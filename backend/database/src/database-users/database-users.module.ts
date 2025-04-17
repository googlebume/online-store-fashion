import { Module } from '@nestjs/common';
import { DatabaseUsersService } from './database-users.service';
import { DatabaseUsersController } from './database-users.controller';

@Module({
  controllers: [DatabaseUsersController],
  providers: [DatabaseUsersService],
})
export class DatabaseUsersModule {}
