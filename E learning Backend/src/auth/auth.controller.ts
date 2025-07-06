import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './Dtos/login.dto';
import { RegisterDto } from './Dtos/register.dto';
import { ForgotPasswordDto } from './Dtos/forgotpassword.dto';
import { ResetPasswordDto } from './Dtos/reset-password.dto';
import { VerifyEmailDto } from './Dtos/verify.dto';
import { ResendVerificationDto } from './Dtos/resendverification.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.fullName,
    );
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyDto.email, verifyDto.token);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body() resendDto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(resendDto.email);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }

  // Development helper endpoints (for testing purposes)
  @Post('dev/verify-email')
  @HttpCode(HttpStatus.OK)
  async manuallyVerifyEmail(@Body() body: { email: string }) {
    return this.authService.manuallyVerifyEmail(body.email);
  }

  @Post('dev/reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPasswordManually(@Body() body: { email: string; newPassword: string }) {
    return this.authService.resetPasswordManually(body.email, body.newPassword);
  }
}

