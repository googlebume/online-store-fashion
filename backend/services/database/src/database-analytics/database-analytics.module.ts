import { Module } from '@nestjs/common';
import { DatabaseAnalyticsService } from './database-analytics.service';
import { DatabaseAnalyticsController } from './database-analytics.controller';
import { ProductsAnalyticsRepository } from '../repositories/products-analytics/baseProductsAnalytics.handler';
import { PrismaService } from '../prisma.service';

/**
 * DatabaseAnalyticsModule
 * Модуль для управління аналітикою продуктів
 * Інжектує ProductsAnalyticsRepository через Dependency Injection
 */
@Module({
  controllers: [DatabaseAnalyticsController],
  providers: [PrismaService, ProductsAnalyticsRepository, DatabaseAnalyticsService],
  exports: [ProductsAnalyticsRepository, DatabaseAnalyticsService]
})
export class DatabaseAnalyticsModule {}
