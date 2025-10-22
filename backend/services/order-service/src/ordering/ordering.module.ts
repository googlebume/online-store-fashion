import { Module } from '@nestjs/common';
import { OrderingService } from './ordering.service';
import { OrderingController } from './ordering.controller';
// import {OrderBaseHandler} from '@da'

@Module({
  // imports: [OrderBaseHandler],
  controllers: [OrderingController],
  providers: [OrderingService],
})
export class OrderingModule {}
