import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Result, fail } from '../../../shared/result';
import { CreatePromoCodeCommand } from '../commands/create-promo-code.command';
import {
  InvalidPromoCodeConfigurationError,
} from '../../../domain/promo-code/exceptions/promo-code.exceptions';
import {
  IPromoCodeRepository,
  PROMO_CODE_REPOSITORY_PORT,
} from '../../../domain/promo-code/ports/promo-code-repository.port';
import { PromoCodeDiscountType } from '../../../domain/promo-code/value-objects/promo-code-discount-type.vo';
import { PromoCodeEntity } from '../../../domain/promo-code/entities/promo-code.entity';

@Injectable()
export class CreatePromoCodeHandler {
  constructor(
    @Inject(PROMO_CODE_REPOSITORY_PORT)
    private readonly promoCodeRepository: IPromoCodeRepository,
  ) {}

  async execute(command: CreatePromoCodeCommand): Promise<Result<PromoCodeEntity, Error>> {
    const discountTypeResult = PromoCodeDiscountType.create(command.discountType);
    if (!discountTypeResult.ok) {
      return fail(discountTypeResult.error);
    }

    if (command.maxProductPrice != null && command.minProductPrice != null && command.maxProductPrice < command.minProductPrice) {
      return fail(new InvalidPromoCodeConfigurationError('maxProductPrice cannot be less than minProductPrice'));
    }

    if (discountTypeResult.value.isPercentage() && command.discountValue > 100) {
      return fail(new InvalidPromoCodeConfigurationError('percentage discount cannot exceed 100'));
    }

    const promoCode = PromoCodeEntity.create(
      randomUUID(),
      command.code,
      discountTypeResult.value,
      command.discountValue,
      command.usageLimit ?? null,
      0,
      command.isActive,
      command.isInfinite,
      command.expiresAt ? new Date(command.expiresAt) : null,
      command.applicableProductTypes,
      command.minProductPrice ?? null,
      command.maxProductPrice ?? null,
    );

    return this.promoCodeRepository.save(promoCode);
  }
}
