import { Injectable } from '@nestjs/common';
import { UserRepository, ICreateUserInput } from '../repositories/user.repository';

/**
 * Database Users Service
 * SOLID Principle: Single Responsibility
 * Handles user-related business logic and delegates data operations to UserRepository
 */
@Injectable()
export class DatabaseUsersService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Get all users with safe data (without passwords)
   */
  async getAllUsers() {
    return this.userRepository.findAllSafe();
  }

  /**
   * Get user by ID
   */
  async getUserByID(id: string) {
    return this.userRepository.findById(id);
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  /**
   * Create new user with email validation
   */
  async addNewUser(data: ICreateUserInput) {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        return {
          success: false,
          message: 'User with this email already exists'
        };
      }

      // Create new user
      const newUser = await this.userRepository.create(data);
      return {
        success: true,
        message: 'User created successfully',
        user: newUser
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Authenticate user with email and password
   */
  async loginUser(email: string, password: string) {
    const user = await this.userRepository.authenticate(email, password);
    
    if (!user) {
      return {
        success: false,
        message: 'Invalid credentials'
      };
    }

    // Return safe user data without password
    return {
      success: true,
      message: 'Login successful',
      user: await this.userRepository.findByIdSafe(user.id)
    };
  }

  /**
   * Delete user by ID
   */
  async deleteUser(id: string) {
    try {
      await this.userRepository.deleteById(id);
      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Update user information
   */
  async updateUser(id: string, data: any) {
    try {
      const updatedUser = await this.userRepository.updateById(id, data);
      return {
        success: true,
        message: 'User updated successfully',
        user: updatedUser
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}