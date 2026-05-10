import { Body, Controller, Get, Logger, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { OrderingService } from './ordering.service';
import {
  CreatePromoCodeDTO,
  OrderDTO,
  UpdatePromoCodeDTO,
  ValidatePromoCodeDTO,
} from '@packages/shared/dto/order.dto';
import { JwtAuthGuard } from '@packages/shared/common/guards/jwt-auth.guard';
import type { Request } from 'express';
import {
  orderSchema,
  promoCodeSchema,
  promoPricingSchema,
} from '@packages/shared/common/swagger/response-schemas';

type AuthUserPayload = {
  id?: string;
  sub?: string;
  userId?: string;
};

@Controller('fashion/ordering')
@ApiTags('Ordering')
export class OrderingController {
  private readonly logger = new Logger(OrderingController.name);

  constructor(private readonly orderingService: OrderingService) {}

  @Post("add")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Create a new order for the authenticated user' })
  @ApiOkResponse({ description: 'Created order', schema: orderSchema })
  async add(@Body() order: OrderDTO, @Req() req: Request & { user: AuthUserPayload }) {
    this.logger.log(`[HTTP:add] Incoming order request. items=${order?.items?.length ?? 0}, email=${order?.email}, total=${order?.total}`);
    this.logger.debug(`[HTTP:add] Payload: ${JSON.stringify(order)}`);
    const userId = req.user?.id ?? req.user?.sub ?? req.user?.userId;
    order.userId = userId;
    this.logger.debug(`[HTTP:add] Resolved userId from jwt payload: ${userId ?? 'undefined'}`);
    return await this.orderingService.add(order)
  }

  @Post('promocodes/validate')
  @ApiOperation({ summary: 'Validate promo code against basket items' })
  @ApiOkResponse({ description: 'Calculated basket pricing with promo code', schema: promoPricingSchema })
  async validatePromoCode(@Body() payload: ValidatePromoCodeDTO) {
    return await this.orderingService.validatePromoCode(payload);
  }

  @Post('promocodes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Create a promo code' })
  @ApiOkResponse({ description: 'Created promo code', schema: promoCodeSchema })
  async createPromoCode(@Body() payload: CreatePromoCodeDTO) {
    return await this.orderingService.createPromoCode(payload);
  }

  @Get('promocodes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'List all promo codes' })
  @ApiOkResponse({
    description: 'Promo code list',
    schema: { type: 'array', items: promoCodeSchema },
  })
  async listPromoCodesHttp() {
    return await this.orderingService.listPromoCodes();
  }

  @Get('promocodes/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Get promo code by id' })
  @ApiParam({ name: 'id', example: '9f5051b7-5f5d-4f6e-9f35-2f3d9aa4f001' })
  @ApiOkResponse({ description: 'Promo code details', schema: promoCodeSchema })
  async getPromoCodeHttp(@Param('id') id: string) {
    return await this.orderingService.getPromoCodeById(id);
  }

  @Post('promocodes/update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Update existing promo code' })
  @ApiOkResponse({ description: 'Updated promo code', schema: promoCodeSchema })
  async updatePromoCodeHttp(@Body() payload: UpdatePromoCodeDTO) {
    return await this.orderingService.updatePromoCode(payload);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Get orders of the authenticated user' })
  @ApiOkResponse({
    description: 'Orders of current user',
    schema: { type: 'array', items: orderSchema },
  })
  async getMyOrders(@Req() req: Request & { user: AuthUserPayload }) {
    const userId = req.user?.id ?? req.user?.sub ?? req.user?.userId;
    return await this.orderingService.getUserOrders(userId as string);
  }
}
