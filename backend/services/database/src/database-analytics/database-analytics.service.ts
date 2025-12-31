import { Injectable } from '@nestjs/common';
import BaseProductsAnalyticsHandler from 'src/repositories/products-analytics/baseProductsAnalytics.handler';

@Injectable()
export class DatabaseAnalyticsService {
    constructor(
        private baseProductsAnalyticsHandler: BaseProductsAnalyticsHandler
    ){}

    async updateRatingMetrics(params) {
        const {productId, metrics} = params
        return this.baseProductsAnalyticsHandler.updateRatingMetrics(productId, metrics)
    }

    async updateEngagementMetrics(params) {
        const {productId, metrics} = params
        return this.baseProductsAnalyticsHandler.updateEngagementMetrics(productId, metrics)
    }

    async createMetricsRecord(params) {
        return this.baseProductsAnalyticsHandler.createMetricsRecord(params)
    }

}
