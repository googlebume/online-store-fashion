import { Injectable, Inject } from '@nestjs/common';
import { Result, fail } from '../../../shared/result';
import { GetUserByEmailQuery } from '../queries/get-user-by-email.query';
import { UserEntity } from '../../../domain/user/entities/user.entity';
import { Email } from '../../../domain/user/value-objects/email.vo';
import { USER_REPOSITORY_PORT, IUserRepository } from '../../../domain/user/ports/user-repository.port';

@Injectable()
export class GetUserByEmailHandler {
  constructor(@Inject(USER_REPOSITORY_PORT) private readonly userRepository: IUserRepository) {}

  async execute(query: GetUserByEmailQuery): Promise<Result<UserEntity, Error>> {
    const emailResult = Email.create(query.email);
    if (!emailResult.ok) return fail(emailResult.error);
    return this.userRepository.findByEmail(emailResult.value);
  }
}
