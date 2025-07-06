import { Injectable, UnauthorizedException, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from './jwt/jwt.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../../Utils/mailer.service';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { addMinutes } from 'date-fns';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  private generateOTP(): string {
    return randomInt(100000, 999999).toString();
  }

  async register(email: string, password: string, fullName: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = this.generateOTP();

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: 'STUDENT',
        isVerified: false,
        verificationToken: otpCode,
      },
    });

    // Send welcome email with OTP (with error handling)
    try {
      await this.mailerService.sendWelcomeEmail(email, fullName, otpCode);
      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.warn(`Failed to send welcome email to ${email}: ${error.message}`);
      // Don't fail registration if email fails
    }

    return {
      message: 'Registration successful! Please check your email for verification code.',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  }

  async verifyEmail(email: string, otpCode: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    if (!user.verificationToken || user.verificationToken !== otpCode) {
      throw new BadRequestException('Invalid OTP code');
    }

    // Verify the email
    await this.prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    return {
      message: 'Email verified successfully! You can now login.',
    };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const otpCode = this.generateOTP();

    await this.prisma.user.update({
      where: { email },
      data: {
        verificationToken: otpCode,
      },
    });

    try {
      await this.mailerService.sendEmailVerification(email, user.fullName, otpCode);
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.warn(`Failed to send verification email to ${email}: ${error.message}`);
      // Don't fail if email fails
    }

    return {
      message: 'Verification code sent to your email',
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Allow admin users to login without verification
    if (!user.isVerified && user.role !== 'ADMIN') {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.generateToken(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isVerified: user.isVerified,
        status: user.status,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otpCode = this.generateOTP();

    await this.prisma.user.update({
      where: { email },
      data: {
        verificationToken: otpCode,
      },
    });

    try {
      await this.mailerService.sendPasswordResetEmail(email, user.fullName, otpCode);
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.warn(`Failed to send password reset email to ${email}: ${error.message}`);
      // Don't fail if email fails
    }

    return {
      message: 'Password reset code sent to your email',
    };
  }

  async resetPassword(email: string, otpCode: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.verificationToken || user.verificationToken !== otpCode) {
      throw new BadRequestException('Invalid OTP code');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        verificationToken: null,
      },
    });

    return {
      message: 'Password reset successfully',
    };
  }

  async validateToken(token: string) {
    return this.jwtService.verifyToken(token);
  }


}
