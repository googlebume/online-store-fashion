import { Module } from '@nestjs/common';
import { DatabaseUsersService } from './database-users.service';
import { DatabaseUsersController } from './database-users.controller';
import { UserRepository } from '../repositories/user.repository';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DatabaseUsersController],
  providers: [DatabaseUsersService, UserRepository, PrismaService],
})
export class DatabaseUsersModule {}
