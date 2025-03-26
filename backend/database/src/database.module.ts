import { Module } from '@nestjs/common';
import { DatabaseController } from './database.controller';
import { DatabaseService } from './database.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [PrismaService ,DatabaseController],
  providers: [PrismaService ,DatabaseService],
})
export class DatabaseModule {}
