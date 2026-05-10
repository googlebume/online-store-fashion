import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles-metadata.decorator';
import { PromoCodesService } from './promo-codes.service';
import { CreatePromoCodeDTO, UpdatePromoCodeDTO } from '@packages/shared/dto/order.dto';
import { promoCodeSchema } from '@packages/shared/common/swagger/response-schemas';

@ApiTags('Admin Promo Codes')
@ApiBearerAuth('bearer')
@Controller('fashion/admin/promo-codes')
export class PromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'List promo codes' })
  @ApiOkResponse({ description: 'Promo code list', schema: { type: 'array', items: promoCodeSchema } })
  listPromoCodes() {
    return this.promoCodesService.listPromoCodes();
  }

  @Roles('admin')
  @Get(':id')
  @ApiOperation({ summary: 'Get promo code by id' })
  @ApiParam({ name: 'id', example: '9f5051b7-5f5d-4f6e-9f35-2f3d9aa4f001' })
  @ApiOkResponse({ description: 'Promo code details', schema: promoCodeSchema })
  getPromoCodeById(@Param('id') id: string) {
    return this.promoCodesService.getPromoCodeById(id);
  }

  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create promo code' })
  @ApiOkResponse({ description: 'Created promo code', schema: promoCodeSchema })
  createPromoCode(@Body() body: CreatePromoCodeDTO) {
    return this.promoCodesService.createPromoCode(body);
  }

  @Roles('admin')
  @Post('update')
  @ApiOperation({ summary: 'Update promo code' })
  @ApiOkResponse({ description: 'Updated promo code', schema: promoCodeSchema })
  updatePromoCode(@Body() body: UpdatePromoCodeDTO) {
    return this.promoCodesService.updatePromoCode(body);
  }
}
