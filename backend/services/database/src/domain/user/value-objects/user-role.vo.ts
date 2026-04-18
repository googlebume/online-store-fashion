import { Result, ok, fail } from '../../../shared/result';
import { InvalidRoleException } from '../exceptions/user.exceptions';

export enum UserRoleEnum {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
  SUPPORT = 'support',
  SYSTEM = 'system',
}

export class UserRole {
  private constructor(readonly value: UserRoleEnum) {}

  static create(raw: string): Result<UserRole, InvalidRoleException> {
    const role = Object.values(UserRoleEnum).find(r => r === raw?.toLowerCase());
    if (!role) {
      return fail(new InvalidRoleException(raw));
    }
    return ok(new UserRole(role as UserRoleEnum));
  }

  static default(): UserRole {
    return new UserRole(UserRoleEnum.USER);
  }

  equals(other: UserRole): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
