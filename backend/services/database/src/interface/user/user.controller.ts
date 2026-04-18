import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserHandler } from '../../application/user/handlers/create-user.handler';
import { LoginUserHandler } from '../../application/user/handlers/login-user.handler';
import { GetUserByIdHandler } from '../../application/user/handlers/get-user-by-id.handler';
import { GetUserByEmailHandler } from '../../application/user/handlers/get-user-by-email.handler';
import { GetAllUsersHandler } from '../../application/user/handlers/get-all-users.handler';
import { UpdateUserHandler } from '../../application/user/handlers/update-user.handler';
import { DeleteUserHandler } from '../../application/user/handlers/delete-user.handler';
import { CreateUserCommand } from '../../application/user/commands/create-user.command';
import { LoginUserCommand } from '../../application/user/commands/login-user.command';
import { GetUserByIdQuery } from '../../application/user/queries/get-user-by-id.query';
import { GetUserByEmailQuery } from '../../application/user/queries/get-user-by-email.query';
import { GetAllUsersQuery } from '../../application/user/queries/get-all-users.query';
import { UpdateUserCommand } from '../../application/user/commands/update-user.command';
import { DeleteUserCommand } from '../../application/user/commands/delete-user.command';
import { Serializers } from '../shared/serializers';

@Controller()
export class UserController {
  constructor(
    private readonly createUserHandler: CreateUserHandler,
    private readonly loginUserHandler: LoginUserHandler,
    private readonly getUserByIdHandler: GetUserByIdHandler,
    private readonly getUserByEmailHandler: GetUserByEmailHandler,
    private readonly getAllUsersHandler: GetAllUsersHandler,
    private readonly updateUserHandler: UpdateUserHandler,
    private readonly deleteUserHandler: DeleteUserHandler,
  ) {}

  @MessagePattern('add_new_user')
  async addNewUser(@Payload() data: any) {
    const result = await this.createUserHandler.execute(
      new CreateUserCommand(data.name, data.email, data.password, data.role),
    );
    if (!result.ok) {
      return { success: false, message: result.error.message };
    }
    return { success: true, message: 'User created successfully', user: Serializers.userToObject(result.value) };
  }

  @MessagePattern('login_user')
  async loginUser(@Payload() data: { email: string; password: string }) {
    const result = await this.loginUserHandler.execute(new LoginUserCommand(data.email, data.password));
    if (!result.ok) {
      return { success: false, message: result.error.message };
    }
    return { success: true, message: 'Login successful', user: Serializers.userToObject(result.value) };
  }

  @MessagePattern('get_user_by_id')
  async getUserById(@Payload() data: { id: string }) {
    const result = await this.getUserByIdHandler.execute(new GetUserByIdQuery(data.id));
    if (!result.ok) {
      return { success: false, message: result.error.message };
    }
    return { success: true, data: result.ok ? (Array.isArray(result.value) ? result.value.map(u => Serializers.userToObject(u)) : Serializers.userToObject(result.value)) : undefined };
  }

  @MessagePattern('get_user_by_email')
  async getUserByEmail(@Payload() data: { email: string }) {
    const result = await this.getUserByEmailHandler.execute(new GetUserByEmailQuery(data.email));
    if (!result.ok) {
      return { success: false, message: result.error.message };
    }
    return { success: true, data: result.ok ? (Array.isArray(result.value) ? result.value.map(u => Serializers.userToObject(u)) : Serializers.userToObject(result.value)) : undefined };
  }

  @MessagePattern('get_all_users')
  async getAllUsers() {
    const result = await this.getAllUsersHandler.execute(new GetAllUsersQuery());
    if (!result.ok) {
      return { success: false, message: result.error.message };
    }
    return { success: true, data: result.ok ? (Array.isArray(result.value) ? result.value.map(u => Serializers.userToObject(u)) : Serializers.userToObject(result.value)) : undefined };
  }

  @MessagePattern('update_user')
  async updateUser(@Payload() data: { id: string; [key: string]: any }) {
    const { id, ...updateData } = data;
    const result = await this.updateUserHandler.execute(
      new UpdateUserCommand(id, updateData.name, updateData.email, updateData.password, updateData.role),
    );
    if (!result.ok) {
      return { success: false, message: result.error.message };
    }
    return { success: true, message: 'User updated successfully', user: Serializers.userToObject(result.value) };
  }

  @MessagePattern('delete_user')
  async deleteUser(@Payload() data: { id: string }) {
    const result = await this.deleteUserHandler.execute(new DeleteUserCommand(data.id));
    if (!result.ok) {
      return { success: false, message: result.error.message };
    }
    return { success: true, message: 'User deleted successfully' };
  }
}
