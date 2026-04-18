import { Injectable, Inject } from '@nestjs/common';
import { Result, ok, fail } from '../../../shared/result';
import { CreateUserCommand } from '../commands/create-user.command';
import { UserEntity } from '../../../domain/user/entities/user.entity';
import { Email } from '../../../domain/user/value-objects/email.vo';
import { UserRole } from '../../../domain/user/value-objects/user-role.vo';
import { HashedPassword } from '../../../domain/user/value-objects/hashed-password.vo';
import { DuplicateEmailError, UserNotFoundError } from '../../../domain/user/exceptions/user.exceptions';
import { USER_REPOSITORY_PORT, IUserRepository } from '../../../domain/user/ports/user-repository.port';
import { PASSWORD_HASHER_PORT, IPasswordHasher } from '../../ports/password-hasher.port';

@Injectable()
export class CreateUserHandler {
  constructor(
    @Inject(USER_REPOSITORY_PORT) private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER_PORT) private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(command: CreateUserCommand): Promise<Result<UserEntity, Error>> {
    const emailResult = Email.create(command.email);
    if (!emailResult.ok) return fail(emailResult.error);

    const roleResult = command.role ? UserRole.create(command.role) : ok(UserRole.default());
    if (!roleResult.ok) return fail(roleResult.error);

    const existingResult = await this.userRepository.findByEmail(emailResult.value);
    if (existingResult.ok && existingResult.value) {
      return fail(new DuplicateEmailError(command.email));
    }

    const hashedPassword = await this.passwordHasher.hash(command.password);
    const passwordResult = HashedPassword.create(hashedPassword);
    if (!passwordResult.ok) return fail(passwordResult.error);

    const user = UserEntity.create(
      '',
      command.name,
      emailResult.value,
      passwordResult.value,
      roleResult.value,
    );

    return this.userRepository.save(user);
  }
}
