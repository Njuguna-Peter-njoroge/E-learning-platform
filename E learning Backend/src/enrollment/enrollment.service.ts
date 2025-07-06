import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from './dtos/create-enrollment.dto'; 
import { UpdateEnrollmentDto } from './dtos/update-enrollment.dto'; 
import { EnrollmentStatus } from '@prisma/client';

@Injectable()
export class EnrollmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEnrollmentDto, userId: string) {
    return this.prisma.enrollment.create({
      data: {
        courseId: dto.courseId,
        userId,
        status: dto.status || EnrollmentStatus.ENROLLED,
      },
    });
  }

  async findAll() {
    return this.prisma.enrollment.findMany({
      include: { user: true, course: true },
    });
  }

  async findOne(id: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      include: { user: true, course: true },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    return enrollment;
  }

  async update(id: string, dto: UpdateEnrollmentDto) {
    return this.prisma.enrollment.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.enrollment.delete({
      where: { id },
    });
  }
}

