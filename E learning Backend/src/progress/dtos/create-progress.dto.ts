import { IsUUID, IsEnum, IsOptional } from 'class-validator';

export enum ProgressStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class CreateProgressDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  lessonId: string;

  @IsEnum(ProgressStatus)
  status: ProgressStatus;

  @IsOptional()
  completedAt?: Date;
}
