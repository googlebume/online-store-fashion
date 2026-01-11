import { Injectable } from '@nestjs/common';
import { BaseRepository } from './core/base-repository.abstract';
import { PrismaService } from './../prisma.service';
import { User } from '@prisma/client';
import { ICreateInput, IUpdateInput, IQueryOptions, IQueryFilter } from './core/types';
import { ErrorHandler } from './core/error-handler';
import * as bcrypt from 'bcryptjs';

export interface ICreateUserInput extends ICreateInput<User> {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface IUpdateUserInput extends IUpdateInput<User> {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

/**
 * User Repository - SOLID Principle: Single Responsibility
 * Only responsible for user data persistence operations
 */
@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected getModel(): any {
    return this.prisma.user;
  }

  /**
   * Find user by email
   * SOLID Principle: Open/Closed - extended without modification
   */
  async findByEmail(email: string, options?: IQueryOptions): Promise<User | null> {
    try {
      return await this.findOne({ email }, options);
    } catch (error) {
      ErrorHandler.handleError(error, 'User');
    }
  }

  /**
   * Create user with password hashing
   * SOLID Principle: Dependency Inversion - uses bcryptjs directly
   */
  override async create(data: ICreateUserInput): Promise<User> {
    try {
      const hashedPassword = await this.hashPassword(data.password);
      const { password: _, ...restData } = data;

      return await this.prisma.user.create({
        data: {
          ...restData,
          password: hashedPassword,
          role: (data.role as any) || 'user',
        },
      });
    } catch (error) {
      ErrorHandler.handleError(error, 'User');
    }
  }

  /**
   * Update user with optional password hashing
   */
  override async updateById(
    id: string | number,
    data: IUpdateUserInput
  ): Promise<User> {
    try {
      const updateData: any = {};

      if (data.email) updateData.email = data.email;
      if (data.username) updateData.username = data.username;
      if (data.password) updateData.password = await this.hashPassword(data.password);
      if (data.role) updateData.role = data.role as any;

      return await this.prisma.user.update({
        where: { id: id as string },
        data: updateData,
      });
    } catch (error) {
      ErrorHandler.handleError(error, 'User');
    }
  }

  /**
   * Authenticate user with email and password
   */
  async authenticate(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.findOne({ email });

      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      return isPasswordValid ? user : null;
    } catch (error) {
      ErrorHandler.handleError(error, 'User');
    }
  }

  /**
   * Find user with safe data (without password)
   */
  async findByIdSafe(id: string | number): Promise<Omit<User, 'password'> | null> {
    try {
      return await this.findOne(
        { id },
        {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        }
      );
    } catch (error) {
      ErrorHandler.handleError(error, 'User');
    }
  }

  /**
   * Find all users with safe data
   */
  async findAllSafe(options?: IQueryOptions): Promise<Omit<User, 'password'>[]> {
    try {
      return await this.findAll({
        ...options,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      ErrorHandler.handleError(error, 'User');
    }
  }

  /**
   * Private method to hash password
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}