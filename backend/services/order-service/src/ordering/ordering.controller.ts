import { Body, Controller, Get, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { OrderingService } from './ordering.service';
import { OrderDTO } from '@packages/shared/dist/src/dto/order.dto';
import { JwtAuthGuard } from '@packages/shared/dist/common/guards/jwt-auth.guard';
import type { Request } from 'express';

type AuthUserPayload = {
  id?: string;
  sub?: string;
  userId?: string;
};

@Controller('fashion/ordering')
export class OrderingController {
  private readonly logger = new Logger(OrderingController.name);

  constructor(private readonly orderingService: OrderingService) {}

  @Post("add")
  @UseGuards(JwtAuthGuard)
  async add(@Body() order: OrderDTO, @Req() req: Request & { user: AuthUserPayload }) {
    this.logger.log(`[HTTP:add] Incoming order request. items=${order?.items?.length ?? 0}, email=${order?.email}, total=${order?.total}`);
    this.logger.debug(`[HTTP:add] Payload: ${JSON.stringify(order)}`);
    const userId = req.user?.id ?? req.user?.sub ?? req.user?.userId;
    order.userId = userId;
    this.logger.debug(`[HTTP:add] Resolved userId from jwt payload: ${userId ?? 'undefined'}`);
    return await this.orderingService.add(order)
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyOrders(@Req() req: Request & { user: AuthUserPayload }) {
    const userId = req.user?.id ?? req.user?.sub ?? req.user?.userId;
    return await this.orderingService.getUserOrders(userId as string);
  }
}
