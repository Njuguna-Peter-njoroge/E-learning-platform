import { IsUUID, IsOptional, IsEnum } from 'class-validator';
import { EnrollmentStatus } from '@prisma/client';

export class CreateEnrollmentDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  courseId: string;

  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus = EnrollmentStatus.ENROLLED;
}
