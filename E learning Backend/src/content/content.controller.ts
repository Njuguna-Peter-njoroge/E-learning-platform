import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ContentService } from './content.service'; 
import { CreateContentDto } from './dtos/create-module.dto'; 
import { UpdateContentDto } from './dtos/update.module.dto'; 

@Controller('modules')
export class ContentController {
  constructor(private readonly moduleService: ContentService) {}

  @Post()
  create(@Body() dto: CreateContentDto) {
    return this.moduleService.create(dto);
  }

  @Get()
  findAll() {
    return this.moduleService.findAll();
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.moduleService.findByCourseId(courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moduleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContentDto) {
    return this.moduleService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moduleService.remove(id);
  }
}

