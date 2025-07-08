import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dtos/create-progress.dto'; 
import { UpdateProgressDto } from './dtos/update-progress.dto'; 
import { JwtAuthGuard } from '../auth/Guards/auth.guards';
import { RolesGuard } from '../auth/Guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorators';
import { Role } from '@prisma/client';

@Controller('progress')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  create(@Body() dto: CreateProgressDto) {
    return this.progressService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  findAll() {
    return this.progressService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  findOne(@Param('id') id: string) {
    return this.progressService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  update(@Param('id') id: string, @Body() dto: UpdateProgressDto) {
    return this.progressService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  remove(@Param('id') id: string) {
    return this.progressService.remove(id);
  }

  // Student-specific endpoints
  @Get('student/tasks')
  @Roles(Role.STUDENT)
  getStudentTasks(@Request() req) {
    return this.progressService.getStudentTasks(req.user.id);
  }

  @Get('student/progress')
  @Roles(Role.STUDENT)
  getStudentProgress(@Request() req) {
    return this.progressService.getStudentProgress(req.user.id);
  }

  @Post('student/tasks/:lessonId/start')
  @Roles(Role.STUDENT)
  startTask(@Request() req, @Param('lessonId') lessonId: string) {
    return this.progressService.startTask(req.user.id, lessonId);
  }

  @Post('student/tasks/:lessonId/complete')
  @Roles(Role.STUDENT)
  completeTask(
    @Request() req, 
    @Param('lessonId') lessonId: string,
    @Body() body: { grade?: number }
  ) {
    return this.progressService.completeTask(req.user.id, lessonId, body.grade);
  }

  @Get('user/:userId')
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  findByUser(@Param('userId') userId: string) {
    return this.progressService.findByUser(userId);
  }

  // Get instructor's students progress
  @Get('instructor/students-progress')
  @Roles(Role.INSTRUCTOR)
  getInstructorStudentsProgress(@Request() req) {
    return this.progressService.getInstructorStudentsProgress(req.user.id);
  }
}
