import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { DeleteUserCommand } from '../commands/delete-user.command';
import { USER_REPOSITORY_PORT, IUserRepository } from '../../../domain/user/ports/user-repository.port';

@Injectable()
export class DeleteUserHandler {
  constructor(@Inject(USER_REPOSITORY_PORT) private readonly userRepository: IUserRepository) {}

  async execute(command: DeleteUserCommand): Promise<Result<void, Error>> {
    return this.userRepository.delete(command.id);
  }
}
