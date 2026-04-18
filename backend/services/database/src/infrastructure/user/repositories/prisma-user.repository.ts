import { Injectable } from '@nestjs/common';
import { Result, ok, fail } from '../../../shared/result';
import { UserEntity } from '../../../domain/user/entities/user.entity';
import { Email } from '../../../domain/user/value-objects/email.vo';
import { IUserRepository } from '../../../domain/user/ports/user-repository.port';
import { UserNotFoundError, DuplicateEmailError } from '../../../domain/user/exceptions/user.exceptions';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Result<UserEntity, Error>> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) return fail(new UserNotFoundError(id));
      return ok(UserMapper.toDomain(user));
    } catch (error) {
      return fail(new Error(`Failed to find user by id: ${error}`));
    }
  }

  async findByEmail(email: Email): Promise<Result<UserEntity, Error>> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: email.value },
      });
      if (!user) return fail(new UserNotFoundError(undefined, email.value));
      return ok(UserMapper.toDomain(user));
    } catch (error) {
      return fail(new Error(`Failed to find user by email: ${error}`));
    }
  }

  async findAll(): Promise<Result<UserEntity[], Error>> {
    try {
      const users = await this.prisma.user.findMany();
      return ok(users.map(u => UserMapper.toDomain(u)));
    } catch (error) {
      return fail(new Error(`Failed to find all users: ${error}`));
    }
  }

  async save(user: UserEntity): Promise<Result<UserEntity, Error>> {
    try {
      const existing = await this.prisma.user.findUnique({ where: { id: user.id } });
      if (existing) {
        return fail(new DuplicateEmailError(user.email.value));
      }

      const data = UserMapper.toPersistence(user);
      const created = await this.prisma.user.create({ data });
      return ok(UserMapper.toDomain(created));
    } catch (error: any) {
      if (error.code === 'P2002') {
        return fail(new DuplicateEmailError(user.email.value));
      }
      return fail(new Error(`Failed to save user: ${error}`));
    }
  }

  async update(id: string, partial: any): Promise<Result<UserEntity, Error>> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) return fail(new UserNotFoundError(id));

      const updated = await this.prisma.user.update({
        where: { id },
        data: partial,
      });
      return ok(UserMapper.toDomain(updated));
    } catch (error) {
      return fail(new Error(`Failed to update user: ${error}`));
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) return fail(new UserNotFoundError(id));

      await this.prisma.user.delete({ where: { id } });
      return ok(undefined);
    } catch (error) {
      return fail(new Error(`Failed to delete user: ${error}`));
    }
  }
}
