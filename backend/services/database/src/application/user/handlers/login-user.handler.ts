import { Injectable, Inject } from '@nestjs/common';
import { Result, fail } from '../../../shared/result';
import { LoginUserCommand } from '../commands/login-user.command';
import { UserEntity } from '../../../domain/user/entities/user.entity';
import { Email } from '../../../domain/user/value-objects/email.vo';
import { InvalidCredentialsError } from '../../../domain/user/exceptions/user.exceptions';
import { USER_REPOSITORY_PORT, IUserRepository } from '../../../domain/user/ports/user-repository.port';
import { PASSWORD_HASHER_PORT, IPasswordHasher } from '../../ports/password-hasher.port';

@Injectable()
export class LoginUserHandler {
  constructor(
    @Inject(USER_REPOSITORY_PORT) private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER_PORT) private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(command: LoginUserCommand): Promise<Result<UserEntity, Error>> {
    const emailResult = Email.create(command.email);
    if (!emailResult.ok) return fail(new InvalidCredentialsError());

    const userResult = await this.userRepository.findByEmail(emailResult.value);
    if (!userResult.ok || !userResult.value) return fail(new InvalidCredentialsError());

    const passwordValid = await this.passwordHasher.compare(command.password, userResult.value.password.hash);
    if (!passwordValid) return fail(new InvalidCredentialsError());

    return userResult;
  }
}
