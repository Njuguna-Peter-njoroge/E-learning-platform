import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dtos/create-enrollment.dto'; 
import { UpdateEnrollmentDto } from './dtos/update-enrollment.dto'; 
import { JwtAuthGuard } from '../auth/Guards/auth.guards';
import { Roles } from 'src/auth/decorators/roles.decorators';

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
   @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateEnrollmentDto, @Request() req) {
    const userId = req.user.id;
    return this.enrollmentService.create(dto, userId);
  }

  @Get()
  findAll() {
    return this.enrollmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEnrollmentDto) {
    return this.enrollmentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentService.remove(id);
  }

  // Development helper endpoint to enroll student by email
  @Post('dev/enroll-by-email')
  async enrollStudentByEmail(@Body() body: { email: string; courseId: string }) {
    return this.enrollmentService.enrollStudentByEmail(body.email, body.courseId);
  }
}
