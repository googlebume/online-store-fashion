import { Injectable, Inject } from '@nestjs/common';
import { Result, fail } from '../../../shared/result';
import { UpdateUserCommand } from '../commands/update-user.command';
import { UserEntity } from '../../../domain/user/entities/user.entity';
import { USER_REPOSITORY_PORT, IUserRepository } from '../../../domain/user/ports/user-repository.port';
import { PASSWORD_HASHER_PORT, IPasswordHasher } from '../../ports/password-hasher.port';
import { Email } from '../../../domain/user/value-objects/email.vo';
import { UserRole } from '../../../domain/user/value-objects/user-role.vo';

@Injectable()
export class UpdateUserHandler {
  constructor(
    @Inject(USER_REPOSITORY_PORT) private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER_PORT) private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(command: UpdateUserCommand): Promise<Result<UserEntity, Error>> {
    const partial: Record<string, unknown> = {};

    if (command.name !== undefined && String(command.name).trim() !== '') {
      partial.name = String(command.name).trim();
    }

    if (command.email !== undefined && String(command.email).trim() !== '') {
      const emailResult = Email.create(command.email);
      if (!emailResult.ok) {
        return fail(emailResult.error);
      }
      partial.email = emailResult.value.value;
    }

    if (command.role !== undefined && String(command.role).trim() !== '') {
      const roleResult = UserRole.create(command.role);
      if (!roleResult.ok) {
        return fail(roleResult.error);
      }
      partial.role = roleResult.value.toString();
    }

    if (command.password !== undefined && String(command.password).trim() !== '') {
      partial.password = await this.passwordHasher.hash(String(command.password).trim());
    }

    if (Object.keys(partial).length === 0) {
      const existing = await this.userRepository.findById(command.id);
      if (!existing.ok) {
        return fail(existing.error);
      }
      return existing;
    }

    return this.userRepository.update(command.id, partial);
  }
}
