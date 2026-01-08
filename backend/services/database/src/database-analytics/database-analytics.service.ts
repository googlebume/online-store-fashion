import { Injectable } from '@nestjs/common';
import BaseProductsAnalyticsHandler from 'src/repositories/products-analytics/baseProductsAnalytics.handler';

@Injectable()
export class DatabaseAnalyticsService {
    constructor(
        private baseProductsAnalyticsHandler: BaseProductsAnalyticsHandler
    ){}

    async findById(id:string) {
        return this.baseProductsAnalyticsHandler.findById(id)
    }

    async updateRatingMetrics(params) {
        const {productId, metrics} = params
        return this.baseProductsAnalyticsHandler.updateRatingMetrics(productId, metrics)
    }

    async updateEngagementMetrics(params) {
        const {id, metrics} = params
        return this.baseProductsAnalyticsHandler.updateEngagementMetrics(id, metrics)
    }

    async createMetricsRecord(params) {
        return this.baseProductsAnalyticsHandler.createMetricsRecord(params)
    }

}
