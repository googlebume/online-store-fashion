import { Body, Controller, Logger, Post } from '@nestjs/common';
import { OrderingService } from './ordering.service';
import { OrderDTO } from '@packages/shared/dist/src/dto/order.dto';

@Controller('fashion/ordering')
export class OrderingController {
  private readonly logger = new Logger(OrderingController.name);

  constructor(private readonly orderingService: OrderingService) {}

  @Post("add")
  async add(@Body() order: OrderDTO){
    this.logger.log(`[HTTP:add] Incoming order request. items=${order?.items?.length ?? 0}, email=${order?.email}, total=${order?.total}`);
    this.logger.debug(`[HTTP:add] Payload: ${JSON.stringify(order)}`);
    return await this.orderingService.add(order)
  }
}
