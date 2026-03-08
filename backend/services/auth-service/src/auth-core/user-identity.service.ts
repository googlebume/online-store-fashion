import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import {
  DatabaseClient,
  DatabaseResponse,
  UserResponse,
} from '../interfaces/database-client.interface';

@Injectable()
export class UserIdentityService {
  constructor(
    @Inject('DATABASE_CLIENT')
    private readonly databaseClient: DatabaseClient,
  ) {}

  async getUserByEmail(email: string) {
    const response = await lastValueFrom<DatabaseResponse<any>>(
      this.databaseClient.send('get_user_by_email', { email }),
    );

    return {
      success: !!response?.success,
      user: response?.data ? this.toSafeUser(response.data) : null,
      message: response?.message,
    };
  }

  async createUser(input: { name: string; email: string; password: string }) {
    const response = await lastValueFrom<UserResponse>(
      this.databaseClient.send('add_new_user', input),
    );

    return {
      success: !!response?.success,
      user: response?.user ? this.toSafeUser(response.user) : null,
      message: response?.message,
    };
  }

  async authenticate(input: { email: string; password: string }) {
    const response = await lastValueFrom<UserResponse>(
      this.databaseClient.send('login_user', input),
    );

    return {
      success: !!response?.success,
      user: response?.user ? this.toSafeUser(response.user) : null,
      message: response?.message,
    };
  }

  normalizeRoles(role: string | string[] | undefined): string[] {
    if (!role) return ['user'];
    return Array.isArray(role) ? role : [role];
  }

  private toSafeUser(user: Record<string, any>): Record<string, any> {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
