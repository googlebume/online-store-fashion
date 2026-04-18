import { Result } from '../../../shared/result';
import { UserEntity } from '../entities/user.entity';
import { Email } from '../value-objects/email.vo';

export const USER_REPOSITORY_PORT = Symbol('IUserRepository');

export interface IUserRepository {
  findById(id: string): Promise<Result<UserEntity>>;
  findByEmail(email: Email): Promise<Result<UserEntity>>;
  findAll(): Promise<Result<UserEntity[]>>;
  save(user: UserEntity): Promise<Result<UserEntity>>;
  update(id: string, partial: Partial<Omit<Record<keyof UserEntity['props'], unknown>, 'email'>>): Promise<Result<UserEntity>>;
  delete(id: string): Promise<Result<void>>;
}
