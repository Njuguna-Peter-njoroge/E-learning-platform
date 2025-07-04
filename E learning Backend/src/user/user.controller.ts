import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { createuserDto } from './Dtos/createuser.dto';
import { updateUserDto } from './Dtos/updateuser.dto';
import { AccountStatus } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: createuserDto) {
    return this.userService.create(dto);
  }

  @Get()
  findAll(@Query('status') status?: AccountStatus) {
    if (status) {
      return this.userService.findByStatus(status);
    }
    return this.userService.findAll();
  }

  @Get('active')
  findActive() {
    return this.userService.findByStatus(AccountStatus.ACTIVE);
  }

  @Get('pending')
  findPending() {
    return this.userService.findByStatus(AccountStatus.PENDING);
  }

  @Get('banned')
  findBanned() {
    return this.userService.findByStatus(AccountStatus.BANNED);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: updateUserDto) {
    return this.userService.update(id, dto);
  }

  @Patch(':id/status/pending')
  setPending(@Param('id') id: string) {
    return this.userService.setStatus(id, AccountStatus.PENDING);
  }

  @Patch(':id/status/active')
  reactivate(@Param('id') id: string) {
    return this.userService.setStatus(id, AccountStatus.ACTIVE);
  }

  @Delete(':id')
  banUser(@Param('id') id: string) {
    return this.userService.banUser(id);
  }
}
