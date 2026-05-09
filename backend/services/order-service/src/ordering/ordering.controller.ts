import { Body, Controller, Get, Logger, Param, Post, Req, UseGuards } from '@nestjs/common';
import { OrderingService } from './ordering.service';
import {
  CreatePromoCodeDTO,
  OrderDTO,
  UpdatePromoCodeDTO,
  ValidatePromoCodeDTO,
} from '@packages/shared/dto/order.dto';
import { JwtAuthGuard } from '@packages/shared/common/guards/jwt-auth.guard';
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

  @Post('promocodes/validate')
  async validatePromoCode(@Body() payload: ValidatePromoCodeDTO) {
    return await this.orderingService.validatePromoCode(payload);
  }

  @Post('promocodes')
  @UseGuards(JwtAuthGuard)
  async createPromoCode(@Body() payload: CreatePromoCodeDTO) {
    return await this.orderingService.createPromoCode(payload);
  }

  @Get('promocodes')
  @UseGuards(JwtAuthGuard)
  async listPromoCodesHttp() {
    return await this.orderingService.listPromoCodes();
  }

  @Get('promocodes/:id')
  @UseGuards(JwtAuthGuard)
  async getPromoCodeHttp(@Param('id') id: string) {
    return await this.orderingService.getPromoCodeById(id);
  }

  @Post('promocodes/update')
  @UseGuards(JwtAuthGuard)
  async updatePromoCodeHttp(@Body() payload: UpdatePromoCodeDTO) {
    return await this.orderingService.updatePromoCode(payload);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyOrders(@Req() req: Request & { user: AuthUserPayload }) {
    const userId = req.user?.id ?? req.user?.sub ?? req.user?.userId;
    return await this.orderingService.getUserOrders(userId as string);
  }
}
