import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {UserResponseDto} from "./Dtos/userResponse.dto";
import {ApiResponse} from "../Shared/apiresponse";
import { createuserDto } from './Dtos/createuser.dto'; 
import * as bcrypt from 'bcrypt';
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/edge";
import {Role, AccountStatus} from "@prisma/client";
import { updateUserDto } from './Dtos/updateuser.dto'; 

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {
    }

    private sanitizeUser(user): UserResponseDto {
        const {password, ...rest} = user;
        return rest as UserResponseDto;
    }

    async create(data: createuserDto): Promise<ApiResponse<UserResponseDto>> {
        const hashedPassword = await bcrypt.hash(data.password, 12);

        try {
            const user = await this.prisma.user.create({
                data: {
                    fullName: data.fullName,
                    email: data.email.toLowerCase(),
                    password: hashedPassword,
                    role: data.role || Role.STUDENT,
                    status: AccountStatus.ACTIVE,
                },
            });


            return {
                success: true,
                message: 'User created successfully',
                data: this.sanitizeUser(user),
            };
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new BadRequestException('Email already exists');
                }
                throw new BadRequestException(`Database error: ${error.message}`);
            }
            throw new InternalServerErrorException('An unexpected error occurred');
        }
    }


    async findAll(): Promise<ApiResponse<UserResponseDto[]>> {
        const users = await this.prisma.user.findMany({
            where: { status: AccountStatus.ACTIVE },
            orderBy: { createdAt: 'desc' },
        });

        return {
            success: true,
            message: 'Users retrieved successfully',
            data: users.map((user) => this.sanitizeUser(user)),
        };
    }

    async findOne(id: string): Promise<ApiResponse<UserResponseDto>> {
        if (!id) throw new BadRequestException('User ID is required');

        const user = await this.prisma.user.findUnique({ where: { id } });

        if (!user || user.status !== AccountStatus.ACTIVE) {
            throw new NotFoundException('User not found or not active');
        }

        return {
            success: true,
            message: 'User retrieved successfully',
            data: this.sanitizeUser(user),
        };
    }

    async findByEmail(email: string): Promise<ApiResponse<UserResponseDto>> {
        if (!email) throw new BadRequestException('Email is required');

        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user || !user.status) {
            throw new NotFoundException('User not found');
        }

        return {
            success: true,
            message: 'User retrieved successfully',
            data: this.sanitizeUser(user),
        };
    }

    async update(
        id: string,
        data: updateUserDto,
    ): Promise<ApiResponse<UserResponseDto>> {
        if (!id) throw new BadRequestException('User ID is required');

        const existingUser = await this.prisma.user.findUnique({ where: { id } });
        if (!existingUser || existingUser.status !== AccountStatus.ACTIVE) {
            throw new NotFoundException('User not found or not active');
        }

        const updateData: any = {};

        // Update name if provided
        if (data.fullName) updateData.fullName = data.fullName;

        // Update email if provided
        if (data.email) {
            // Check if email is already taken by another user
            const emailExists = await this.prisma.user.findFirst({
                where: {
                    email: data.email.toLowerCase(),
                    id: { not: id },
                },
            });
            if (emailExists) {
                throw new BadRequestException('Email already exists');
            }
            updateData.email = { set: data.email.toLowerCase() };
        }

        // Update password if provided
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 12);
        }

        // Update role if provided
        if (data.role) updateData.role = data.role;

        try {
            const updatedUser = await this.prisma.user.update({
                where: { id },
                data: updateData,
            });

            return {
                success: true,
                message: 'User updated successfully',
                data: this.sanitizeUser(updatedUser),
            };
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new BadRequestException('Email already exists');
                }
                if (error.code === 'P2025') {
                    throw new NotFoundException('User not found');
                }
            }
            throw new BadRequestException('Failed to update user');
        }
    }

    async deleteUser(id: string): Promise<ApiResponse<{ message: string }>> {
        if (!id) throw new BadRequestException('User ID is required');

        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('User not found');

        await this.prisma.user.update({
            where: { id },
            data: { status: AccountStatus.ACTIVE },
        });

        return {
            success: true,
            message: 'User deactivated successfully',
            data: { message: 'User deactivated successfully' },
        };
    }

    async changePassword(
        id: string,
        currentPassword: string,
        newPassword: string,
    ): Promise<{ message: string }> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id },
            });

            if (!user) {
                throw new NotFoundException(`User with id ${id} not found`);
            }

            // Verify the current password
            const isCurrentPasswordValid = await bcrypt.compare(
                currentPassword,
                user.password,
            );
            if (!isCurrentPasswordValid) {
                throw new ConflictException('Current password is incorrect');
            }

            // Hash new password
            const saltRounds = 10;
            const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

            await this.prisma.user.update({
                where: { id },
                data: { password: hashedNewPassword },
            });

            return { message: 'Password changed successfully' };
        } catch (error) {
            if (
                error instanceof NotFoundException ||
                error instanceof ConflictException
            ) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to change password');
        }
    }

    async banUser(id: string): Promise<ApiResponse<UserResponseDto>> {
        const user = await this.prisma.user.update({
            where: { id },
            data: { status: AccountStatus.BANNED },
        });
        return {
            success: true,
            message: 'User banned successfully',
            data: this.sanitizeUser(user),
        };
    }

    async findByStatus(status: AccountStatus): Promise<ApiResponse<any[]>> {
        const users = await this.prisma.user.findMany({
            where: { status },
            orderBy: { createdAt: 'desc' },
        });
        return {
            success: true,
            message: `Users with status ${status} retrieved successfully`,
            data: users.map(this.sanitizeUser),
        };
    }

    async setStatus(id: string, status: AccountStatus): Promise<ApiResponse<any>> {
        const user = await this.prisma.user.update({
            where: { id },
            data: { status },
        });
        return {
            success: true,
            message: `User status set to ${status}`,
            data: this.sanitizeUser(user),
        };
    }
}
