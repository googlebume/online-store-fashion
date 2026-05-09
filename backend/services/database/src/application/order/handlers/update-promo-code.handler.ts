import { Inject, Injectable } from '@nestjs/common';
import { Result, fail } from '../../../shared/result';
import { UpdatePromoCodeCommand } from '../commands/update-promo-code.command';
import {
  IPromoCodeRepository,
  PROMO_CODE_REPOSITORY_PORT,
} from '../../../domain/promo-code/ports/promo-code-repository.port';
import { PromoCodeDiscountType } from '../../../domain/promo-code/value-objects/promo-code-discount-type.vo';
import { PromoCodeEntity, PromoCodeProps } from '../../../domain/promo-code/entities/promo-code.entity';
import { InvalidPromoCodeConfigurationError } from '../../../domain/promo-code/exceptions/promo-code.exceptions';

@Injectable()
export class UpdatePromoCodeHandler {
  constructor(
    @Inject(PROMO_CODE_REPOSITORY_PORT)
    private readonly promoCodeRepository: IPromoCodeRepository,
  ) {}

  async execute(command: UpdatePromoCodeCommand): Promise<Result<PromoCodeEntity, Error>> {
    const loaded = await this.promoCodeRepository.findById(command.id);
    if (!loaded.ok) {
      return loaded;
    }
    const entity = loaded.value;

    let discountType = entity.discountType;
    if (command.discountType !== undefined) {
      const dt = PromoCodeDiscountType.create(command.discountType);
      if (!dt.ok) {
        return fail(dt.error);
      }
      discountType = dt.value;
    }

    const nextDiscountValue = command.discountValue ?? entity.discountValue;

    if (discountType.isPercentage() && nextDiscountValue > 100) {
      return fail(new InvalidPromoCodeConfigurationError('percentage discount cannot exceed 100'));
    }

    const maxP = command.maxProductPrice !== undefined ? command.maxProductPrice : entity.maxProductPrice;
    const minP = command.minProductPrice !== undefined ? command.minProductPrice : entity.minProductPrice;
    if (maxP != null && minP != null && maxP < minP) {
      return fail(new InvalidPromoCodeConfigurationError('maxProductPrice cannot be less than minProductPrice'));
    }

    if (command.code !== undefined) {
      const normalized = command.code.trim().toUpperCase();
      const taken = await this.promoCodeRepository.existsOtherWithCode(normalized, entity.id);
      if (taken) {
        return fail(new InvalidPromoCodeConfigurationError(`promo code ${normalized} is already in use`));
      }
    }

    let expiresAt: Date | null | undefined = entity.expiresAt;
    if (command.expiresAt !== undefined) {
      expiresAt = command.expiresAt === null ? null : new Date(command.expiresAt);
    }

    const props: PromoCodeProps = {
      code: command.code !== undefined ? command.code.trim().toUpperCase() : entity.code,
      discountType,
      discountValue: nextDiscountValue,
      usageLimit: command.usageLimit !== undefined ? command.usageLimit : entity.usageLimit,
      usedCount: entity.usedCount,
      isActive: command.isActive !== undefined ? command.isActive : entity.isActive,
      isInfinite: command.isInfinite !== undefined ? command.isInfinite : entity.isInfinite,
      expiresAt,
      applicableProductTypes:
        command.applicableProductTypes !== undefined ? command.applicableProductTypes : entity.applicableProductTypes,
      minProductPrice: command.minProductPrice !== undefined ? command.minProductPrice : entity.minProductPrice,
      maxProductPrice: command.maxProductPrice !== undefined ? command.maxProductPrice : entity.maxProductPrice,
      createdAt: entity.createdAt,
      updatedAt: new Date(),
    };

    const updated = PromoCodeEntity.withProps(entity.id, props);
    return this.promoCodeRepository.update(updated);
  }
}
