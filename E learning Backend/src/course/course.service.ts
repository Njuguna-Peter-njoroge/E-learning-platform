import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}


  async create(dto: CreateCourseDto, userId: string) {

    // Verify the instructor exists
    const instructor = await this.prisma.user.findUnique({
      where: { id: dto.instructorName },

    });

    if (!instructor) {

      throw new NotFoundException(`Instructor with ID ${dto.instructorName} not found`)
    }

    if (instructor.role !== 'INSTRUCTOR' && instructor.role !== 'ADMIN') {
      throw new ForbiddenException('Only instructors and admins can create courses');
    }

    // Ensure the authenticated user is the same as the instructor or is an admin
 
    if (userId !== instructor.id && instructor.role !== 'ADMIN') {
      throw new ForbiddenException('You can only create courses for your own account');

    }

    return this.prisma.course.create({
      data: {
        iconImage: dto.iconImage ?? undefined, // optional
        title: dto.title,
        description: dto.description,
        level: dto.level,
        category: dto.category,
        status: dto.status,
        instructorId: instructor.id,
      },
    });
  }

  // Get all courses (with instructor + modules)
  async findAll() {
    return this.prisma.course.findMany({
      include: {
        instructor: true,
        modules: true,
      },
    });
  }

  // Get course by ID
  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: true,
        modules: true,
      },
    });

    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  // Update course using instructorName (if provided)
  async update(id: string, dto: UpdateCourseDto) {
    let instructorId: string | undefined;

    if (dto.instructorName) {
      const instructor = await this.prisma.user.findFirst({
        where: {
          fullName: dto.instructorName,
          role: 'INSTRUCTOR',
        },
      });

      if (!instructor) {
        throw new NotFoundException(
          `Instructor '${dto.instructorName}' not found`,
        );
      }

      instructorId = instructor.id;
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        iconImage: dto.iconImage ?? undefined,
        title: dto.title,
        description: dto.description,
        level: dto.level,
        category: dto.category,
        status: dto.status,
        instructorId: instructorId ?? undefined,
      },
    });
  }

  async remove(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');

    return this.prisma.course.delete({
      where: { id },
    });
  }
}
