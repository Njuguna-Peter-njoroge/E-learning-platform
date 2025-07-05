import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { PrismaModule } from 'src/prisma/prisma.module'; // adjust path if needed

@Module({
  imports: [PrismaModule],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
