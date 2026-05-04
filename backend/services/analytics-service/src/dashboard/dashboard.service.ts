import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { databaseClient } from '../database.client';

@Injectable()
export class DashboardService {
  async getDashboard() {
    const result = await lastValueFrom(databaseClient.send('get-analytics-dashboard', {}));
    return result as {
      success: boolean;
      message?: string;
      data?: unknown;
    };
  }
}
