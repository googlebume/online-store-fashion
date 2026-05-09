import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Roles } from '../common/decorators/roles-metadata.decorator';
import { PromoCodesService } from './promo-codes.service';
import { CreatePromoCodeDTO, UpdatePromoCodeDTO } from '@packages/shared/dto/order.dto';

@Controller('fashion/admin/promo-codes')
export class PromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  @Roles('admin')
  @Get()
  listPromoCodes() {
    return this.promoCodesService.listPromoCodes();
  }

  @Roles('admin')
  @Get(':id')
  getPromoCodeById(@Param('id') id: string) {
    return this.promoCodesService.getPromoCodeById(id);
  }

  @Roles('admin')
  @Post()
  createPromoCode(@Body() body: CreatePromoCodeDTO) {
    return this.promoCodesService.createPromoCode(body);
  }

  @Roles('admin')
  @Post('update')
  updatePromoCode(@Body() body: UpdatePromoCodeDTO) {
    return this.promoCodesService.updatePromoCode(body);
  }
}
