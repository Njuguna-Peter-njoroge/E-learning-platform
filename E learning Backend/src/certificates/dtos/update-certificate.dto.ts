import { PartialType } from '@nestjs/mapped-types';
import { CreateCertificateDto } from './create-certificates.dto'; 

export class UpdateCertificateDto extends PartialType(CreateCertificateDto) {}
