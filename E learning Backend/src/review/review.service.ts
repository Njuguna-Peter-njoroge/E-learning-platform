import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dtos/create-review.dto'; 
import { UpdateReviewDto } from './dtos/update-review.dto'; 

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        courseId: dto.courseId,
        userId,
      },
    });
  }

  async findAll(courseId: string) {
    return this.prisma.review.findMany({
      where: { courseId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, dto: UpdateReviewDto) {
    const existing = await this.prisma.review.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Review not found');

    return this.prisma.review.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.review.delete({ where: { id } });
  }

  async approve(id: string) {
    return this.prisma.review.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
  }

  async reject(id: string) {
    return this.prisma.review.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }
}
