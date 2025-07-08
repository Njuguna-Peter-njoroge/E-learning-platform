import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { JwtAuthGuard } from '../auth/Guards/auth.guards';
import { RolesGuard } from '../auth/Guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorators';
import { User } from '../auth/decorators/roles.decorators';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  create(@Body() dto: CreateCourseDto, @User() user: { id: string }) {
    return this.courseService.create(dto, user.id);
  }

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get('instructor/my-courses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR')
  findInstructorCourses(@User() user: { id: string }) {
    return this.courseService.findByInstructor(user.id);
  }

  @Get('instructor/dashboard-stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR')
  getInstructorDashboardStats(@User() user: { id: string }) {
    return this.courseService.getInstructorDashboardStats(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.courseService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}

