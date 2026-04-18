import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { GetUserByIdQuery } from '../queries/get-user-by-id.query';
import { UserEntity } from '../../../domain/user/entities/user.entity';
import { USER_REPOSITORY_PORT, IUserRepository } from '../../../domain/user/ports/user-repository.port';

@Injectable()
export class GetUserByIdHandler {
  constructor(@Inject(USER_REPOSITORY_PORT) private readonly userRepository: IUserRepository) {}

  async execute(query: GetUserByIdQuery): Promise<Result<UserEntity, Error>> {
    return this.userRepository.findById(query.id);
  }
}
