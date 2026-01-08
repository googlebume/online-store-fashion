import { PrismaService } from "src/prisma.service";
import pickDefined from '@packages/shared/dist/src/utils/pick-defined'
import { Injectable } from '@nestjs/common';

type EngagementMetrics = {
    views: number
    clicks: number
    orders: number
}

type RatingMetrics = {
    reviews: number
    maxRating: number
    minRating: number
}

type ProductMetrics = {
    id: string,
    engagementMetrics: EngagementMetrics,
    ratingMetrics: RatingMetrics,
}


@Injectable()
class BaseProductsAnalyticsHandler {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async findById(id: string) {
        return await this.prisma.producsAnalytics.findUnique({ where: { productId: id } });
    }

    async createMetricsRecord(params) {
        const { id, metrics } = params

        return this.prisma.producsAnalytics.create({
            data: {
                views: metrics.views || 0,
                clicks: metrics.clicks || 0,
                orders: metrics.orders || 0,

                reviews: 0,
                maxRating: 0,
                minRating: 0,

                product: {
                    connect: { id }
                }
            }
        })
    }

    async updateEngagementMetrics(
        productId: string,
        metrics: Partial<EngagementMetrics>
    ) {
        console.log('updateEngagementMetrics called with productId:', productId, 'metrics:', metrics)

        const lastRecord = await this.findById(productId)
        console.log('lastRecord found:', lastRecord)

        if (!lastRecord) {
            console.log('No record found, returning null')
            return null
        }

        const data = pickDefined({
            views: lastRecord.views + (metrics.views || 0),
            clicks: lastRecord.clicks + (metrics.clicks || 0),
            orders: lastRecord.orders + (metrics.orders || 0),
        })

        console.log('Data to update:', data)

        if (Object.keys(data).length === 0) {
            console.log('No data to update')
            return null
        }

        const result = await this.prisma.producsAnalytics.update({
            where: { productId: productId },
            data,
        })
        
        console.log('Update result:', result)
        return result
    }

    async updateRatingMetrics(
        productId: string,
        metrics: Partial<RatingMetrics>
    ) {
        const data = pickDefined({
            reviews: metrics.reviews,
            maxRating: metrics.maxRating,
            minRating: metrics.minRating,
        })

        if (Object.keys(data).length === 0) {
            return null
        }

        return this.prisma.producsAnalytics.update({
            where: { id: productId },
            data,
        })
    }
}

export default BaseProductsAnalyticsHandler