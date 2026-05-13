// @ts-nocheck
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Result, fail, ok } from '../../../shared/result';
import {
  IPromoCodeRepository,
} from '../../../domain/promo-code/ports/promo-code-repository.port';
import { PromoCodeEntity } from '../../../domain/promo-code/entities/promo-code.entity';
import { PromoCodeNotFoundError } from '../../../domain/promo-code/exceptions/promo-code.exceptions';
import { PromoCodeMapper } from '../mappers/promo-code.mapper';

@Injectable()
export class PrismaPromoCodeRepository implements IPromoCodeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Result<PromoCodeEntity, Error>> {
    try {
      const promoCode = await this.prisma.promoCode.findUnique({
        where: { id },
        include: { applicableProductTypes: true },
      });
      if (!promoCode) {
        return fail(new PromoCodeNotFoundError(id));
      }
      return ok(PromoCodeMapper.toDomain(promoCode));
    } catch (error) {
      return fail(new Error(`Failed to find promo code: ${error}`));
    }
  }

  async findAll(): Promise<Result<PromoCodeEntity[], Error>> {
    try {
      const rows = await this.prisma.promoCode.findMany({
        include: { applicableProductTypes: true },
        orderBy: { createdAt: 'desc' },
      });
      return ok(rows.map(row => PromoCodeMapper.toDomain(row)));
    } catch (error) {
      return fail(new Error(`Failed to list promo codes: ${error}`));
    }
  }

  async existsOtherWithCode(code: string, excludeId: string): Promise<boolean> {
    const normalized = code.trim().toUpperCase();
    const found = await this.prisma.promoCode.findFirst({
      where: { code: normalized, NOT: { id: excludeId } },
      select: { id: true },
    });
    return Boolean(found);
  }

  async findByCode(code: string): Promise<Result<PromoCodeEntity, Error>> {
    try {
      const promoCode = await this.prisma.promoCode.findUnique({
        where: {
          code: code.trim().toUpperCase(),
        },
        include: {
          applicableProductTypes: true,
        },
      });

      if (!promoCode) {
        return fail(new PromoCodeNotFoundError(code));
      }

      return ok(PromoCodeMapper.toDomain(promoCode));
    } catch (error) {
      return fail(new Error(`Failed to find promo code: ${error}`));
    }
  }

  async save(promoCode: PromoCodeEntity): Promise<Result<PromoCodeEntity, Error>> {
    try {
      const persisted = PromoCodeMapper.toPersistence(promoCode);
      const created = await this.prisma.promoCode.create({
        data: {
          ...persisted,
          applicableProductTypes: {
            create: promoCode.applicableProductTypes.map(type => ({ type: type as any })),
          },
        },
        include: {
          applicableProductTypes: true,
        },
      });

      return ok(PromoCodeMapper.toDomain(created));
    } catch (error) {
      return fail(new Error(`Failed to save promo code: ${error}`));
    }
  }

  async update(promoCode: PromoCodeEntity): Promise<Result<PromoCodeEntity, Error>> {
    try {
      const updated = await this.prisma.promoCode.update({
        where: { id: promoCode.id },
        data: {
          code: promoCode.code,
          discountType: promoCode.discountType.toString() as any,
          discountValue: promoCode.discountValue,
          usageLimit: promoCode.usageLimit ?? null,
          usedCount: promoCode.usedCount,
          isActive: promoCode.isActive,
          isInfinite: promoCode.isInfinite,
          expiresAt: promoCode.expiresAt ?? null,
          minProductPrice: promoCode.minProductPrice ?? null,
          maxProductPrice: promoCode.maxProductPrice ?? null,
          updatedAt: new Date(),
          applicableProductTypes: {
            deleteMany: {},
            create: promoCode.applicableProductTypes.map(type => ({ type: type as any })),
          },
        },
        include: { applicableProductTypes: true },
      });
      return ok(PromoCodeMapper.toDomain(updated));
    } catch (error) {
      return fail(new Error(`Failed to update promo code: ${error}`));
    }
  }

  async incrementUsage(id: string): Promise<Result<void, Error>> {
    try {
      await this.prisma.promoCode.update({
        where: { id },
        data: {
          usedCount: {
            increment: 1,
          },
        },
      });

      return ok(undefined);
    } catch (error) {
      return fail(new Error(`Failed to increment promo code usage: ${error}`));
    }
  }
}
