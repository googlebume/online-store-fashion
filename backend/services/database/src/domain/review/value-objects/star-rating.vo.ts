import { Result, fail, ok } from '../../../shared/result';

export class StarRating {
  private constructor(readonly value: number) {}

  static create(raw: number): Result<StarRating, Error> {
    if (!Number.isInteger(raw) || raw < 1 || raw > 5) {
      return fail(new Error('Оцінка має бути цілим числом від 1 до 5'));
    }
    return ok(new StarRating(raw));
  }

  equals(other: StarRating): boolean {
    return this.value === other.value;
  }
}
