import { Controller, Post, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Development helper endpoints
  @Post('dev/create-admin')
  @HttpCode(HttpStatus.OK)
  async createAdminUser() {
    return this.adminService.createAdminUser();
  }

  @Get('dev/debug-users')
  async debugUsers() {
    return this.adminService.debugUsers();
  }

  @Get('dev/admin-login-info')
  async getAdminLoginInfo() {
    return this.adminService.getAdminLoginInfo();
  }
}
