import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import {
  analyticsDashboardSchema,
  promoRedemptionsSchema,
} from '@packages/shared/common/swagger/response-schemas';

@ApiTags('Analytics Dashboard')
@Controller('fashion/analytics')
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get aggregated analytics dashboard payload' })
  @ApiOkResponse({ description: 'Analytics dashboard', schema: analyticsDashboardSchema })
  async getDashboard() {
    const result = await this.dashboard.getDashboard();
    if (!result.success) {
      throw new HttpException(
        result.message || 'Failed to load analytics',
        HttpStatus.BAD_GATEWAY,
      );
    }
    return {
      success: true,
      data: result.data,
    };
  }

  @Get('promo-redemptions')
  @ApiOperation({ summary: 'Get promo code redemption statistics' })
  @ApiOkResponse({ description: 'Promo redemption stats', schema: promoRedemptionsSchema })
  async getPromoRedemptions() {
    const result = await this.dashboard.getPromoRedemptionStats();
    if (!result.success) {
      throw new HttpException(
        result.message || 'Failed to load promo stats',
        HttpStatus.BAD_GATEWAY,
      );
    }
    return {
      success: true,
      data: result.data,
    };
  }
}
