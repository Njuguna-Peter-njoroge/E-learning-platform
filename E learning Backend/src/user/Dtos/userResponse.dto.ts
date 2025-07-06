import { Role, AccountStatus } from '@prisma/client';

export class UserResponseDto {
    id: string;
    fullName: string;
    email: string;
    role: Role;
    isVerified: boolean;
    status: AccountStatus;
    createdAt: Date;
    updatedAt: Date;
    profileImage?: string | null;
}
