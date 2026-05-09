import { Inject, Injectable } from '@nestjs/common';
import { Result } from '../../../shared/result';
import {
  IPromoCodeRepository,
  PROMO_CODE_REPOSITORY_PORT,
} from '../../../domain/promo-code/ports/promo-code-repository.port';
import { PromoCodeEntity } from '../../../domain/promo-code/entities/promo-code.entity';

@Injectable()
export class ListPromoCodesHandler {
  constructor(
    @Inject(PROMO_CODE_REPOSITORY_PORT)
    private readonly promoCodeRepository: IPromoCodeRepository,
  ) {}

  async execute(): Promise<Result<PromoCodeEntity[], Error>> {
    return this.promoCodeRepository.findAll();
  }
}
