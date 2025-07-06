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

  // Development helper method to enroll student by email
  async enrollStudentByEmail(email: string, courseId: string) {
    // Find the student by email
    const student = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Find the course
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if already enrolled
    const existingEnrollment = await this.prisma.enrollment.findFirst({
      where: {
        userId: student.id,
        courseId: courseId,
      },
    });

    if (existingEnrollment) {
      return {
        message: 'Student is already enrolled in this course',
        enrollment: existingEnrollment,
      };
    }

    // Create enrollment
    const enrollment = await this.prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: courseId,
        status: EnrollmentStatus.ENROLLED,
      },
      include: {
        user: { select: { email: true, fullName: true } },
        course: { select: { title: true } },
      },
    });

    return {
      message: 'Student enrolled successfully',
      enrollment,
    };
  }
}

