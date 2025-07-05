import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;

  @IsString()
  courseId: string;
}
