import { IsString, IsUUID, IsNotEmpty, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class QuizOptionDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class QuizQuestionDto {
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @IsString()
  @IsNotEmpty()
  type: 'MCQ' | 'SHORT_ANSWER';

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizOptionDto)
  choices?: QuizOptionDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  answers?: string[]; // For MCQ, these are the correct answers (can be one or more)

  @IsOptional()
  @IsString()
  correctAnswer?: string; // For SHORT_ANSWER, this is the expected answer
}

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizQuestionDto)
  questions: QuizQuestionDto[];
}
