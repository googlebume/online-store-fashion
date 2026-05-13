// @ts-nocheck
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Result, ok, fail } from '../../../shared/result';
import {
  IReviewRepository,
  ProductReviewStats,
  REVIEW_REPOSITORY_PORT,
  ReviewListResult,
} from '../../../domain/review/ports/review-repository.port';
import { ReviewEntity } from '../../../domain/review/entities/review.entity';
import { DuplicateProductReviewError } from '../../../domain/review/exceptions/review.exceptions';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ReviewMapper } from '../mappers/review.mapper';

@Injectable()
export class PrismaReviewRepository implements IReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(review: ReviewEntity): Promise<Result<ReviewEntity, Error>> {
    try {
      const saved = await this.prisma.$transaction(async tx => {
        const row = await tx.reviews.create({
          data: {
            id: review.id,
            userId: review.userId,
            productId: review.productId,
            userName: review.userName,
            reviewTitle: review.reviewTitle,
            rewiew: review.text,
            stars: review.stars.value,
          },
        });
        await this.syncProductAnalytics(tx, review.productId);
        return row;
      });

      const mapped = ReviewMapper.toDomain(saved);
      if (!mapped.ok) {
        return mapped;
      }
      return ok(mapped.value);
    } catch (error: unknown) {
      if (this.isUniqueViolation(error)) {
        return fail(new DuplicateProductReviewError());
      }
      return fail(new Error(`Не вдалося зберегти відгук: ${error}`));
    }
  }

  async findByProductId(
    productId: string,
    skip: number,
    take: number,
  ): Promise<Result<ReviewListResult, Error>> {
    try {
      const [rows, total] = await this.prisma.$transaction([
        this.prisma.reviews.findMany({
          where: { productId },
          orderBy: { createdAt: 'desc' },
          skip,
          take,
        }),
        this.prisma.reviews.count({ where: { productId } }),
      ]);

      const items: ReviewEntity[] = [];
      for (const row of rows) {
        const mapped = ReviewMapper.toDomain(row);
        if (!mapped.ok) {
          return mapped;
        }
        items.push(mapped.value);
      }

      return ok({ items, total });
    } catch (error) {
      return fail(new Error(`Не вдалося отримати відгуки: ${error}`));
    }
  }

  async getStatsByProductId(productId: string): Promise<Result<ProductReviewStats, Error>> {
    try {
      const [aggregate, groups] = await this.prisma.$transaction([
        this.prisma.reviews.aggregate({
          where: { productId },
          _avg: { stars: true },
          _count: { _all: true },
        }),
        this.prisma.reviews.groupBy({
          by: ['stars'],
          where: { productId },
          _count: { _all: true },
        }),
      ]);

      const distribution: ProductReviewStats['distribution'] = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      for (const g of groups) {
        const k = g.stars as 1 | 2 | 3 | 4 | 5;
        if (k >= 1 && k <= 5) {
          distribution[k] = (g._count as { _all: number })._all;
        }
      }

      const totalReviews = aggregate._count._all;
      const averageRating =
        totalReviews === 0 ? 0 : Number((aggregate._avg.stars ?? 0).toFixed(2));

      return ok({
        totalReviews,
        averageRating,
        distribution,
      });
    } catch (error) {
      return fail(new Error(`Не вдалося порахувати статистику відгуків: ${error}`));
    }
  }

  private async syncProductAnalytics(
    tx: Prisma.TransactionClient,
    productId: string,
  ): Promise<void> {
    const aggregate = await tx.reviews.aggregate({
      where: { productId },
      _count: { _all: true },
      _max: { stars: true },
      _min: { stars: true },
    });

    const count = aggregate._count._all;
    if (count === 0) {
      return;
    }

    await tx.producsAnalytics.upsert({
      where: { productId },
      create: {
        productId,
        views: 0,
        clicks: 0,
        orders: 0,
        reviews: count,
        maxRating: aggregate._max.stars ?? 0,
        minRating: aggregate._min.stars ?? 0,
      },
      update: {
        reviews: count,
        maxRating: aggregate._max.stars ?? 0,
        minRating: aggregate._min.stars ?? 0,
      },
    });
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'P2002'
    );
  }
}
