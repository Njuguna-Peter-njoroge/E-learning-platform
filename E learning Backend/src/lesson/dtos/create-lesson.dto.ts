import { IsString, IsInt, IsEnum, IsNotEmpty } from 'class-validator';
import { ContentStatus } from '@prisma/client';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  content: string;

  @IsString()
  moduleId: string;

  @IsInt()
  order: number;

  @IsEnum(ContentStatus)
  visibility: ContentStatus;
}
