import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch, 
  Delete, 
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './Dtos/createuser.dto';
import { UpdateUserDto } from './Dtos/updateuser.dto';
import { ChangePasswordDto } from './Dtos/change-password.dto';
import { UserFiltersDto } from './Dtos/user-filters.dto';
import { AccountStatus, Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/Guards/auth.guards';
import { RolesGuard } from '../auth/Guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorators';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  findAll(@Query() filters: UserFiltersDto) {
    if (filters.status || filters.role || filters.isVerified || filters.search) {
      return this.userService.findWithFilters(filters);
    }
    return this.userService.findAll();
  }

  @Get('active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  findActive() {
    return this.userService.findByStatus(AccountStatus.ACTIVE);
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  findPending() {
    return this.userService.findByStatus(AccountStatus.PENDING);
  }

  @Get('banned')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  findBanned() {
    return this.userService.findByStatus(AccountStatus.BANNED);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getUserStats() {
    return this.userService.getUserStats();
  }

  @Get('paginated')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  findWithPagination(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return this.userService.findWithPagination(pageNum, limitNum);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT)
  getProfile(@Request() req) {
    return this.userService.findOne(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT)
  updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    return this.userService.update(req.user.id, dto);
  }

  @Patch(':id/password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  changePassword(@Param('id') id: string, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(id, dto.currentPassword, dto.newPassword);
  }

  @Patch('profile/password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT)
  changeOwnPassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.id, dto.currentPassword, dto.newPassword);
  }

  @Patch(':id/status/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  setPending(@Param('id') id: string) {
    return this.userService.setStatus(id, AccountStatus.PENDING);
  }

  @Patch(':id/status/active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  reactivate(@Param('id') id: string) {
    return this.userService.setStatus(id, AccountStatus.ACTIVE);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  banUser(@Param('id') id: string) {
    return this.userService.banUser(id);
  }

  @Post('bulk/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  bulkUpdateStatus(
    @Body() body: { ids: string[]; status: AccountStatus }
  ) {
    return this.userService.bulkUpdateStatus(body.ids, body.status);
  }

  @Post('bulk/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  bulkDelete(@Body() body: { ids: string[] }) {
    return this.userService.bulkDelete(body.ids);
  }


}
