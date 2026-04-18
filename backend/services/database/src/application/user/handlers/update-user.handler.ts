import { Injectable, Inject } from '@nestjs/common';
import { Result, fail } from '../../../shared/result';
import { UpdateUserCommand } from '../commands/update-user.command';
import { UserEntity } from '../../../domain/user/entities/user.entity';
import { USER_REPOSITORY_PORT, IUserRepository } from '../../../domain/user/ports/user-repository.port';
import { PASSWORD_HASHER_PORT, IPasswordHasher } from '../../ports/password-hasher.port';

@Injectable()
export class UpdateUserHandler {
  constructor(
    @Inject(USER_REPOSITORY_PORT) private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER_PORT) private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(command: UpdateUserCommand): Promise<Result<UserEntity, Error>> {
    const partial: any = {};
    if (command.name) partial.name = command.name;
    if (command.role) partial.role = command.role;
    if (command.password) {
      partial.password = await this.passwordHasher.hash(command.password);
    }
    return this.userRepository.update(command.id, partial);
  }
}
