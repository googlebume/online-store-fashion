import { Module } from '@nestjs/common';
import { DatabaseUsersService } from './database-users.service';
import { DatabaseUsersController } from './database-users.controller';
import { UserRepository } from '../repositories/user.repository';
import { PrismaService } from '../prisma.service';

/**
 * DatabaseUsersModule
 * Модуль для управління користувачами
 * Інжектує UserRepository через Dependency Injection
 */
@Module({
  controllers: [DatabaseUsersController],
  providers: [PrismaService, UserRepository, DatabaseUsersService],
  exports: [UserRepository, DatabaseUsersService]
})
export class DatabaseUsersModule {}
