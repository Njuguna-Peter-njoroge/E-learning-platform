import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProgressDto } from './dtos/create-progress.dto'; 
import { UpdateProgressDto } from './dtos/update-progress.dto'; 

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProgressDto) {
    return this.prisma.progress.create({ data: dto });
  }

  async findAll() {
    return this.prisma.progress.findMany({
      include: {
        user: true,
        lesson: true,
      },
    });
  }

  async findOne(id: string) {
    const progress = await this.prisma.progress.findUnique({
      where: { id },
      include: { user: true, lesson: true },
    });
    if (!progress) throw new NotFoundException('Progress not found');
    return progress;
  }

  async update(id: string, dto: UpdateProgressDto) {
    return this.prisma.progress.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.progress.delete({ where: { id } });
  }

  async findByUser(userId: string) {
    return this.prisma.progress.findMany({
      where: { userId },
      include: { lesson: true },
    });
  }
}
