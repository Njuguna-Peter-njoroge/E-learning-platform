import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dtos/create-progress.dto'; 
import { UpdateProgressDto } from './dtos/update-progress.dto'; 

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  create(@Body() dto: CreateProgressDto) {
    return this.progressService.create(dto);
  }

  @Get()
  findAll() {
    return this.progressService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.progressService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.progressService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProgressDto) {
    return this.progressService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.progressService.remove(id);
  }
}
