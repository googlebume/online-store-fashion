import { Body, Controller, Post } from '@nestjs/common';
import { OrderingService } from './ordering.service';
import { OrderDTO } from '@packages/shared/dist/src/dto/order.dto';

@Controller('fashion/ordering')
export class OrderingController {
  constructor(private readonly orderingService: OrderingService) {}

  @Post("add")
  async add(@Body() order: OrderDTO){
    // console.log(order.items)
    return await this.orderingService.add(order)
  }
}
