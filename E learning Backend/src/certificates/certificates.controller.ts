import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CertificateService } from './certificates.service'; 
import { CreateCertificateDto } from './dtos/create-certificates.dto'; 
import { UpdateCertificateDto } from './dtos/update-certificate.dto'; 

@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  create(@Body() dto: CreateCertificateDto) {
    return this.certificateService.create(dto);
  }

  @Get()
  findAll() {
    return this.certificateService.findAll();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.certificateService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificateService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCertificateDto) {
    return this.certificateService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.certificateService.remove(id);
  }
}
