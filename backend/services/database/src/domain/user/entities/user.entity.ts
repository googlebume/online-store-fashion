import { Entity } from '../../../shared/entity.base';
import { Email } from '../value-objects/email.vo';
import { HashedPassword } from '../value-objects/hashed-password.vo';
import { UserRole } from '../value-objects/user-role.vo';

export interface UserProps {
  name: string;
  email: Email;
  password: HashedPassword;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity extends Entity<string, UserProps> {
  get name(): string {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get password(): HashedPassword {
    return this.props.password;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  changeName(newName: string): void {
    const updated = this.updateProps('name', newName);
    Object.assign(this.props, { ...updated, updatedAt: new Date() });
  }

  changePassword(newPassword: HashedPassword): void {
    const updated = this.updateProps('password', newPassword);
    Object.assign(this.props, { ...updated, updatedAt: new Date() });
  }

  changeRole(newRole: UserRole): void {
    const updated = this.updateProps('role', newRole);
    Object.assign(this.props, { ...updated, updatedAt: new Date() });
  }

  static create(
    id: string,
    name: string,
    email: Email,
    password: HashedPassword,
    role: UserRole,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ): UserEntity {
    return new UserEntity(id, {
      name,
      email,
      password,
      role,
      createdAt,
      updatedAt,
    });
  }
}
