import { DomainException } from '../../shared/exceptions/domain-exception';

export class InvalidEmailException extends DomainException {
  constructor(email: string) {
    super(`Invalid email format: ${email}`, 'INVALID_EMAIL');
  }
}

export class InvalidPasswordException extends DomainException {
  constructor(reason: string) {
    super(`Invalid password: ${reason}`, 'INVALID_PASSWORD');
  }
}

export class InvalidRoleException extends DomainException {
  constructor(role: string) {
    super(`Invalid role: ${role}`, 'INVALID_ROLE');
  }
}

export class UserNotFoundError extends DomainException {
  constructor(id?: string, email?: string) {
    const detail = id ? `id: ${id}` : email ? `email: ${email}` : 'unknown';
    super(`User not found (${detail})`, 'USER_NOT_FOUND');
  }
}

export class DuplicateEmailError extends DomainException {
  constructor(email: string) {
    super(`User with email ${email} already exists`, 'DUPLICATE_EMAIL');
  }
}

export class InvalidCredentialsError extends DomainException {
  constructor() {
    super('Invalid credentials', 'INVALID_CREDENTIALS');
  }
}
