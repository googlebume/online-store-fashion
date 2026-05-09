import { Inject, Injectable } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { GetPromoCodeByIdQuery } from '../queries/get-promo-code-by-id.query';
import {
  IPromoCodeRepository,
  PROMO_CODE_REPOSITORY_PORT,
} from '../../../domain/promo-code/ports/promo-code-repository.port';
import { PromoCodeEntity } from '../../../domain/promo-code/entities/promo-code.entity';

@Injectable()
export class GetPromoCodeByIdHandler {
  constructor(
    @Inject(PROMO_CODE_REPOSITORY_PORT)
    private readonly promoCodeRepository: IPromoCodeRepository,
  ) {}

  async execute(query: GetPromoCodeByIdQuery): Promise<Result<PromoCodeEntity, Error>> {
    return this.promoCodeRepository.findById(query.id);
  }
}
