import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { databaseClient } from 'src/database.client';

@Injectable()
export class ProductsAnalyticsService {

    async updateEngagementMetrics(params) {
        const { id, metrics } = params
        
        if (!id) {
            throw new HttpException('Product ID is required', HttpStatus.BAD_REQUEST)
        }

        const isExist = await lastValueFrom(databaseClient.send('get_product_analytics_by_id', id))
        console.log(isExist)
        try {
            if (isExist) {
                return await lastValueFrom(databaseClient.send('update-engagement-metrics', params))
            }
            if (!isExist) {
                return await lastValueFrom(databaseClient.send('create-metrics-record', params))
            }
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }

}
