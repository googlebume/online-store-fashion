import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { GetAllUsersQuery } from '../queries/get-all-users.query';
import { UserEntity } from '../../../domain/user/entities/user.entity';
import { USER_REPOSITORY_PORT, IUserRepository } from '../../../domain/user/ports/user-repository.port';

@Injectable()
export class GetAllUsersHandler {
  constructor(@Inject(USER_REPOSITORY_PORT) private readonly userRepository: IUserRepository) {}

  async execute(query: GetAllUsersQuery): Promise<Result<UserEntity[], Error>> {
    return this.userRepository.findAll();
  }
}
