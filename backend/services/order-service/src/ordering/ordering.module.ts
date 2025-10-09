import { Module } from '@nestjs/common';
import { OrderingService } from './ordering.service';
import { OrderingController } from './ordering.controller';

@Module({
  controllers: [OrderingController],
  providers: [OrderingService],
})
export class OrderingModule {}
