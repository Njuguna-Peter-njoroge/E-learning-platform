import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; 
import { CreateCertificateDto } from './dtos/create-certificates.dto';
import { UpdateCertificateDto } from './dtos/update-certificate.dto'; 

@Injectable()
export class CertificateService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCertificateDto) {
    return this.prisma.certificate.create({ data: dto });
  }

  async findAll() {
    return this.prisma.certificate.findMany();
  }

  async findByUserId(userId: string) {
    return this.prisma.certificate.findMany({ where: { userId } });
  }

  async findOne(id: string) {
    const cert = await this.prisma.certificate.findUnique({ where: { id } });
    if (!cert) throw new NotFoundException('Certificate not found');
    return cert;
  }

  async update(id: string, dto: UpdateCertificateDto) {
    return this.prisma.certificate.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.certificate.delete({ where: { id } });
  }
}
