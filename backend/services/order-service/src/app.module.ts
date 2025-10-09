import { Module } from '@nestjs/common';
import { OrderingModule } from './ordering/ordering.module';

@Module({
  imports: [
    OrderingModule
  ],
  controllers: [],
  providers: [],
})
export class OrderModule { }
