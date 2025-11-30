import { PrismaService } from "src/prisma.service";

class BaseProductsAnalyticsHandler {
    constructor(
        private readonly prisma: PrismaService
    ) { }
    async update(params: { id: string, key: string, value: string | number }) {
        try {
            const updated = this.prisma.producsAnalytics.update({
                where: { id: params.id },
                data: {
                    [params.key]: params.value
                }
            })
            return updated
        } catch (error) {
            console.error("Update analytics error:", error);
            throw error;
        }
    }
}