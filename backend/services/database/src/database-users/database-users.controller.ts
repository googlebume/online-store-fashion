import { Controller } from '@nestjs/common';
import { DatabaseUsersService } from './database-users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

/**
 * Database Users Controller
 * Microservice controller using MessagePattern for inter-service communication
 * All methods follow the repository pattern through DatabaseUsersService
 */
@Controller()
export class DatabaseUsersController {
  constructor(private readonly databaseUsersService: DatabaseUsersService) {}

  /**
   * Get all users - microservice message pattern
   */
  @MessagePattern('get_all_users')
  async getAllUsers() {
    try {
      return await this.databaseUsersService.getAllUsers();
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Get user by ID - microservice message pattern
   */
  @MessagePattern('get_user_by_id')
  async getUserByID(@Payload() data: { id: string }) {
    try {
      const user = await this.databaseUsersService.getUserByID(data.id);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Get user by email - microservice message pattern
   */
  @MessagePattern('get_user_by_email')
  async getUserByEmail(@Payload() data: { email: string }) {
    try {
      const user = await this.databaseUsersService.getUserByEmail(data.email);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Add new user - microservice message pattern
   */
  @MessagePattern('add_new_user')
  async addNewUser(@Payload() data: any) {
    return this.databaseUsersService.addNewUser(data);
  }

  /**
   * Login user - microservice message pattern
   */
  @MessagePattern('login_user')
  async loginUser(@Payload() data: { email: string; password: string }) {
    return this.databaseUsersService.loginUser(data.email, data.password);
  }

  /**
   * Delete user - microservice message pattern
   */
  @MessagePattern('delete_user')
  async deleteUser(@Payload() data: { id: string }) {
    return this.databaseUsersService.deleteUser(data.id);
  }

  /**
   * Update user - microservice message pattern
   */
  @MessagePattern('update_user')
  async updateUser(@Payload() data: { id: string; [key: string]: any }) {
    const { id, ...updateData } = data;
    return this.databaseUsersService.updateUser(id, updateData);
  }
}
