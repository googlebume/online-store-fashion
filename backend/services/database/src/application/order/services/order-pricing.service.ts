import { Inject, Injectable } from '@nestjs/common';
import {
  IProductRepository,
  PRODUCT_REPOSITORY_PORT,
} from '../../../domain/product/ports/product-repository.port';
import {
  IPromoCodeRepository,
  PROMO_CODE_REPOSITORY_PORT,
} from '../../../domain/promo-code/ports/promo-code-repository.port';
import {
  PromoCodeApplicationResult,
  PromoCodeApplicationService,
} from '../../../domain/promo-code/services/promo-code-application.service';
import { InvalidOrderItemException } from '../../../domain/order/exceptions/order.exceptions';
import { getOrThrow } from '../../../shared/result';

export interface OrderPricingItemInput {
  productId: string;
  quantity: number;
}

export interface PreparedOrderItem {
  productId: string;
  quantity: number;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
}

export interface PreparedOrderPricing {
  subtotal: number;
  promoDiscountTotal: number;
  total: number;
  promoCodeId?: string;
  promoCode?: string;
  items: PreparedOrderItem[];
  appliedItems: PromoCodeApplicationResult['appliedItems'];
}

@Injectable()
export class OrderPricingService {
  private readonly promoCodeApplicationService = new PromoCodeApplicationService();

  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT) private readonly productRepository: IProductRepository,
    @Inject(PROMO_CODE_REPOSITORY_PORT) private readonly promoCodeRepository: IPromoCodeRepository,
  ) {}

  async prepare(items: OrderPricingItemInput[], promoCodeRaw?: string): Promise<PreparedOrderPricing> {
    const products = getOrThrow(
      await this.productRepository.findManyByIdsWithAttributes(items.map(item => item.productId)),
    );

    const productsById = new Map(products.map(product => [product.id, product]));

    const normalizedItems = items.map(item => {
      const product = productsById.get(item.productId);

      if (!product) {
        throw new InvalidOrderItemException(`Product not found: ${item.productId}`);
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new InvalidOrderItemException(`Quantity must be a positive integer for product ${item.productId}`);
      }

      const unitPrice = product.getPriceAfterDiscount().value;
      const primaryAttributes = product.attributes?.[0];

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        productType: primaryAttributes?.type,
      };
    });

    const subtotal = this.round(
      normalizedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    );

    if (!promoCodeRaw?.trim()) {
      return {
        subtotal,
        promoDiscountTotal: 0,
        total: subtotal,
        items: normalizedItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          originalPrice: this.round(item.unitPrice),
          discountAmount: 0,
          finalPrice: this.round(item.unitPrice),
        })),
        appliedItems: normalizedItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          isEligible: false,
          unitPrice: this.round(item.unitPrice),
          originalLineTotal: this.round(item.unitPrice * item.quantity),
          discountPerUnit: 0,
          discountTotal: 0,
          finalLineTotal: this.round(item.unitPrice * item.quantity),
        })),
      };
    }

    const promoCode = getOrThrow(await this.promoCodeRepository.findByCode(promoCodeRaw));
    const application = this.promoCodeApplicationService.evaluate(promoCode, normalizedItems);

    return {
      subtotal: application.subtotal,
      promoDiscountTotal: application.discountTotal,
      total: application.total,
      promoCodeId: application.promoCodeId,
      promoCode: application.promoCode,
      items: application.appliedItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        originalPrice: item.unitPrice,
        discountAmount: item.discountPerUnit,
        finalPrice: this.round(Math.max(0, item.unitPrice - item.discountPerUnit)),
      })),
      appliedItems: application.appliedItems,
    };
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
