import { Result, ok, fail } from '../../../shared/result';
import { InvalidEmailException } from '../exceptions/user.exceptions';

export class Email {
  private constructor(readonly value: string) {}

  static create(raw: string): Result<Email, InvalidEmailException> {
    if (!raw || typeof raw !== 'string') {
      return fail(new InvalidEmailException(raw));
    }

    const trimmed = raw.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmed)) {
      return fail(new InvalidEmailException(raw));
    }

    return ok(new Email(trimmed));
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
