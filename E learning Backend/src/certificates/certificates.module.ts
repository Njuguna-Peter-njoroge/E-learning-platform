import { Module } from '@nestjs/common';
import { CertificateService } from './certificates.service'; 
import { CertificateController } from './certificates.controller'; 
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CertificateController],
  providers: [CertificateService, PrismaService],
  exports: [CertificateService],
})
export class CertificatesModule {}

