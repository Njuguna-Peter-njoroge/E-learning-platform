import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dtos/create-lesson.dto'; 
import { UpdateLessonDto } from './dtos/update-lesson.dto'; 
import { JwtAuthGuard } from '../auth/Guards/auth.guards';
import { RolesGuard } from '../auth/Guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorators';
import { Role } from '@prisma/client';

@Controller('lessons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  create(@Body() dto: CreateLessonDto) {
    return this.lessonService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT)
  findAll() {
    return this.lessonService.findAll();
  }

  @Get('module/:moduleId')
  @Roles(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT)
  findByModule(@Param('moduleId') moduleId: string) {
    return this.lessonService.findByModule(moduleId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT)
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  remove(@Param('id') id: string) {
    return this.lessonService.remove(id);
  }
}
