import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';

export enum CertificateStatus {
  GENERATED = 'GENERATED',
  REVOKED = 'REVOKED',
}

export class CreateCertificateDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  courseId: string;

  @IsOptional()
  @IsString()
  certificateUrl?: string;

  @IsOptional()
  @IsEnum(CertificateStatus)
  status?: CertificateStatus;
}
