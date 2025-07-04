import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dtos/create-course.dto'; 
import { UpdateCourseDto } from './dtos/update-course.dto'; 

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCourseDto) {
    const instructor = await this.prisma.user.findUnique({
      where: { id: dto.instructorId },
    });
  
    if (!instructor) {
      throw new Error(`Instructor with ID ${dto.instructorId} not found`);
    }
  
    return this.prisma.course.create({
      data: dto,
    });
  }
  

  async findAll() {
    return this.prisma.course.findMany({
      include: { instructor: true, modules: true },
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async update(id: string, dto: UpdateCourseDto) {
    return this.prisma.course.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.course.delete({ where: { id } });
  }
}

