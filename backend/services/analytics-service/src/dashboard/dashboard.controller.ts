import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('fashion/analytics')
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get('dashboard')
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
}
