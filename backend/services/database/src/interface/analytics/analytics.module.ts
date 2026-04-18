import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { PrismaService } from '../../infrastructure/shared/prisma/prisma.service';

@Module({
  controllers: [AnalyticsController],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AnalyticsModule {}
