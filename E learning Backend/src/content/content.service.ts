import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContentDto } from './dtos/create-module.dto'; 
import { UpdateContentDto } from './dtos/update.module.dto'; 

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContentDto) {
    return this.prisma.module.create({ data: dto });
  }

  async findAll() {
    return this.prisma.module.findMany({ include: { course: true } });
  }

  async findOne(id: string) {
    const mod = await this.prisma.module.findUnique({ where: { id } });
    if (!mod) throw new NotFoundException('Module not found');
    return mod;
  }

  async update(id: string, dto: UpdateContentDto) {
    return this.prisma.module.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.module.delete({ where: { id } });
  }

  async findByCourseId(courseId: string) {
    return this.prisma.module.findMany({ where: { courseId } });
  }
}

