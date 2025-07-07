import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
  imports: [PrismaModule, AuthModule],

import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule,AuthModule], master
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
