import { PrismaService } from "src/prisma.service";

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

    async create(params: ProductMetrics) {
        const engagementMetrics = params.engagementMetrics;
        const ratingMetrics = params.ratingMetrics;
        try {
            const created = this.prisma.producsAnalytics.create({
                data: {
                    views: engagementMetrics.views,
                    clicks: engagementMetrics.clicks,
                    orders: engagementMetrics.orders,
                    reviews: ratingMetrics.reviews,
                    maxRating: ratingMetrics.maxRating,
                    minRating: ratingMetrics.minRating,

                    product: {
                        connect: {
                            id: params.id
                        }
                    }
                }
            })
            return created
        } catch (error) {
            console.error("Create analytics error:", error);
            throw error;
        }
    }

    async update(params: ProductMetrics) {
        const engagementMetrics = params.engagementMetrics;
        const ratingMetrics = params.ratingMetrics;
        try {
            const updated = this.prisma.producsAnalytics.update({
                where: { id: params.id },
                data: {
                    views: engagementMetrics.views,
                    clicks: engagementMetrics.clicks,
                    orders: engagementMetrics.orders,
                    reviews: ratingMetrics.reviews,
                    maxRating: ratingMetrics.maxRating,
                    minRating: ratingMetrics.minRating,
                }
            })
            return updated
        } catch (error) {
            console.error("Update analytics error:", error);
            throw error;
        }
    }
}

export default BaseProductsAnalyticsHandler