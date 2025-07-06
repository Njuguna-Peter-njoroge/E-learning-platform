import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonDto } from './dtos/create-lesson.dto'; 
import { UpdateLessonDto } from './dtos/update-lesson.dto'; 

@Injectable()
export class LessonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLessonDto) {
    // Check if a lesson with the same title already exists in this module
    const existingLesson = await this.prisma.lesson.findFirst({
      where: {
        moduleId: dto.moduleId,
        title: dto.title,
      },
    });

    if (existingLesson) {
      throw new ConflictException(`A lesson with title "${dto.title}" already exists in this module`);
    }

    return this.prisma.lesson.create({ data: dto });
  }

  async findAll() {
    return this.prisma.lesson.findMany({
      include: { module: true },
    });
  }

  async findByModule(moduleId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { moduleId },
      include: { module: true },
      orderBy: { order: 'asc' },
    });
    
    if (!lessons.length) {
      throw new NotFoundException(`No lessons found for module ${moduleId}`);
    }
    
    return lessons;
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  async update(id: string, dto: UpdateLessonDto) {
    // If title is being updated, check for conflicts
    if (dto.title) {
      const existingLesson = await this.prisma.lesson.findFirst({
        where: {
          moduleId: dto.moduleId || undefined,
          title: dto.title,
          id: { not: id }, // Exclude current lesson
        },
      });

      if (existingLesson) {
        throw new ConflictException(`A lesson with title "${dto.title}" already exists in this module`);
      }
    }

    return this.prisma.lesson.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.lesson.delete({ where: { id } });
  }
}

