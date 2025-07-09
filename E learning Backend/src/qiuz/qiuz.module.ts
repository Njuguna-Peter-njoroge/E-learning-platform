import { Module } from '@nestjs/common';
import { QuizService } from './qiuz.service'; 
import { QuizController } from './qiuz.controller'; 
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [QuizController],
  providers: [QuizService, PrismaService],
})
export class QuizModule {}

