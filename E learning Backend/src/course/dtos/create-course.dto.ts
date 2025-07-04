import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { CourseStatus, Difficulty } from '@prisma/client';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsEnum(Difficulty)
  level: Difficulty;

  @IsString()
  category: string;

  @IsEnum(CourseStatus)
  status: CourseStatus;

  @IsString()
  instructorId: string;
}
