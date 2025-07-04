import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dtos/create-question.dto'; 
import { UpdateQuestionDto } from './dtos/update-question.dto'; 

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateQuestionDto) {
    return this.prisma.question.create({ data: dto });
  }

  findAll() {
    return this.prisma.question.findMany({ include: { options: true } });
  }

  findOne(id: string) {
    return this.prisma.question.findUnique({
      where: { id },
      include: { options: true },
    });
  }

  async update(id: string, dto: UpdateQuestionDto) {
    const existing = await this.prisma.question.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Question not found');
    return this.prisma.question.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.question.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Question not found');
    return this.prisma.question.delete({ where: { id } });
  }
}
