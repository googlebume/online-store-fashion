import { UserEntity } from '../../../domain/user/entities/user.entity';
import { Email } from '../../../domain/user/value-objects/email.vo';
import { HashedPassword } from '../../../domain/user/value-objects/hashed-password.vo';
import { UserRole } from '../../../domain/user/value-objects/user-role.vo';

export type PrismaUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export class UserMapper {
  static toDomain(raw: PrismaUser): UserEntity {
    const email = Email.create(raw.email);
    const password = HashedPassword.create(raw.password);
    const role = UserRole.create(raw.role);

    if (!email.ok || !password.ok || !role.ok) {
      throw new Error('Failed to map Prisma user to domain entity');
    }

    return UserEntity.create(
      raw.id,
      raw.name,
      email.value,
      password.value,
      role.value,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toPersistence(entity: UserEntity): any {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email.value,
      password: entity.password.hash,
      role: entity.role.toString(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
