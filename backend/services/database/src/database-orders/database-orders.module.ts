import { Module } from '@nestjs/common';
import { DatabaseOrdersService } from './database-orders.service';
import { DatabaseOrdersController } from './database-orders.controller';

@Module({
  controllers: [DatabaseOrdersController],
  providers: [DatabaseOrdersService],
})
export class DatabaseOrdersModule {}
