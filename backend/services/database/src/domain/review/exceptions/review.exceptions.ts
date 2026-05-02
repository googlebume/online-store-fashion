import { DomainException } from '../../shared/exceptions/domain-exception';

export class DuplicateProductReviewError extends DomainException {
  constructor() {
    super('Ви вже залишили відгук для цього товару', 'DUPLICATE_PRODUCT_REVIEW');
  }
}

export class ReviewNotFoundError extends DomainException {
  constructor(id?: string) {
    super(id ? `Відгук не знайдено: ${id}` : 'Відгук не знайдено', 'REVIEW_NOT_FOUND');
  }
}
