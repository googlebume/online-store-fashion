import { PrismaService } from "src/prisma.service";
import pickDefined from '@packages/shared/dist/src/utils/pick-defined'

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


class BaseProductsAnalyticsHandler {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async createMetricsRecord(params: ProductMetrics) {
        const { id, engagementMetrics, ratingMetrics } = params

        return this.prisma.producsAnalytics.create({
            data: {
                views: engagementMetrics.views,
                clicks: engagementMetrics.clicks,
                orders: engagementMetrics.orders,

                reviews: ratingMetrics.reviews,
                maxRating: ratingMetrics.maxRating,
                minRating: ratingMetrics.minRating,

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
        const data = pickDefined({
            views: metrics.views,
            clicks: metrics.clicks,
            orders: metrics.orders,
        })

        if (Object.keys(data).length === 0) {
            return null
        }

        return this.prisma.producsAnalytics.update({
            where: { id: productId },
            data,
        })
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