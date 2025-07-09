import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { QuizService } from './qiuz.service'; 
import { CreateQuizDto } from './dtos/create-quiz.dto'; 
import { UpdateQuizDto } from './dtos/update-quiz.dto';
import { JwtAuthGuard } from '../auth/Guards/auth.guards';
import { RolesGuard } from '../auth/Guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorators';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  create(@Body() dto: CreateQuizDto, @Request() req) {
    // Ensure only instructors and admins can create quizzes
    if (req.user.role !== 'INSTRUCTOR' && req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only instructors and admins can create quizzes');
    }
    return this.quizService.create(dto, req.user.id);
  }

  @Get()
  findAll() {
    return this.quizService.findAll();
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.quizService.findByCourse(courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateQuizDto, @Request() req) {
    if (req.user.role !== 'INSTRUCTOR' && req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only instructors and admins can update quizzes');
    }
    return this.quizService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  remove(@Param('id') id: string, @Request() req) {
    if (req.user.role !== 'INSTRUCTOR' && req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only instructors and admins can delete quizzes');
    }
    return this.quizService.remove(id);
  }

  // New endpoints for quiz completion tracking
  @Post(':id/complete')
  @UseGuards(JwtAuthGuard)
  submitQuizCompletion(@Param('id') quizId: string, @Body() submission: any, @Request() req) {
    return this.quizService.submitQuizCompletion(quizId, submission, req.user.id);
  }

  @Get(':id/progress')
  @UseGuards(JwtAuthGuard)
  getQuizProgress(@Param('id') quizId: string, @Request() req) {
    return this.quizService.getQuizProgress(quizId, req.user.id);
  }

  @Get('course/:courseId/progress')
  @UseGuards(JwtAuthGuard)
  getStudentQuizProgress(@Param('courseId') courseId: string, @Request() req) {
    return this.quizService.getStudentQuizProgress(courseId, req.user.id);
  }

  @Get('course/:courseId/instructor-progress')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  getInstructorQuizProgress(@Param('courseId') courseId: string, @Request() req) {
    if (req.user.role !== 'INSTRUCTOR' && req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only instructors and admins can view quiz progress');
    }
    return this.quizService.getInstructorQuizProgress(courseId, req.user.id);
  }

  @Patch(':id/progress')
  @UseGuards(JwtAuthGuard)
  saveQuizProgress(@Param('id') quizId: string, @Body() progress: any, @Request() req) {
    return this.quizService.saveQuizProgress(quizId, progress, req.user.id);
  }
}
