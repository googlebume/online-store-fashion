import { Module } from '@nestjs/common';
import { OrderingService } from './ordering.service';
import { OrderingController } from './ordering.controller';
import { OrderingMicroController } from './ordering-micro.controller';
// import {OrderBaseHandler} from '@da'

@Module({
  // imports: [OrderBaseHandler],
  controllers: [OrderingController, OrderingMicroController],
  providers: [OrderingService],
})
export class OrderingModule {}
