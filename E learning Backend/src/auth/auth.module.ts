import { Module } from '@nestjs/common';
import { JwtStrategy } from "./Strategies/jwt.strategy";
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from './jwt/jwt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MailerModule } from '../../Utils/mailermodule';
import { JwtAuthGuard } from './Guards/auth.guards';
import { RolesGuard } from './Guards/roles.guards';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    PrismaModule,
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, JwtService, AuthService, JwtAuthGuard, RolesGuard],
  exports: [JwtModule, JwtService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
