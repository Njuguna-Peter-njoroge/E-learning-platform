import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dtos/create-review.dto'; 
import { UpdateReviewDto } from './dtos/update-review.dto'; 
import { JwtAuthGuard } from 'src/auth/Guards/auth.guards'; 
master

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateReviewDto) {
    return this.reviewService.create(req.user.id, dto);
  }

  @Get('course/:courseId')
  findAll(@Param('courseId') courseId: string) {
    return this.reviewService.findAll(courseId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.reviewService.approve(id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.reviewService.reject(id);
  }
}
