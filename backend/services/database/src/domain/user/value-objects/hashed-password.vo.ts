import { Result, ok, fail } from '../../../shared/result';
import { InvalidPasswordException } from '../exceptions/user.exceptions';

export class HashedPassword {
  private constructor(readonly hash: string) {}

  static create(hash: string): Result<HashedPassword, InvalidPasswordException> {
    if (!hash || typeof hash !== 'string' || hash.length < 8) {
      return fail(new InvalidPasswordException('Hash must be a non-empty string of at least 8 characters'));
    }
    return ok(new HashedPassword(hash));
  }

  equals(other: HashedPassword): boolean {
    return this.hash === other.hash;
  }

  toString(): string {
    return this.hash;
  }
}
