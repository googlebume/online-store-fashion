import { Result } from '../../../shared/result';
import { PromoCodeEntity } from '../entities/promo-code.entity';

export const PROMO_CODE_REPOSITORY_PORT = Symbol('IPromoCodeRepository');

export interface IPromoCodeRepository {
  findByCode(code: string): Promise<Result<PromoCodeEntity>>;
  findById(id: string): Promise<Result<PromoCodeEntity>>;
  findAll(): Promise<Result<PromoCodeEntity[], Error>>;
  existsOtherWithCode(code: string, excludeId: string): Promise<boolean>;
  save(promoCode: PromoCodeEntity): Promise<Result<PromoCodeEntity>>;
  update(promoCode: PromoCodeEntity): Promise<Result<PromoCodeEntity, Error>>;
  incrementUsage(id: string): Promise<Result<void>>;
}
