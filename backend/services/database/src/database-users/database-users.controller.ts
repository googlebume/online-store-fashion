import { Controller } from '@nestjs/common';
import { DatabaseUsersService } from './database-users.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class DatabaseUsersController {
    constructor(private readonly databaseUsersService: DatabaseUsersService) { }
    @MessagePattern('get_all_users')
    async getAllUsers() {
        return this.databaseUsersService.getAllUsers()
    }
    @MessagePattern('get_user_by_id')
    async getUserByID(data: { id: string }) {
        return this.databaseUsersService.getUserByID(data.id)
    }
    @MessagePattern('get_user_by_email')
    async getUserByEmail(data: {email: string}) {
        return this.databaseUsersService.getUserByEmail(data.email)
    }
    @MessagePattern('add_new_user')
    async addNewUser(data){
        return this.databaseUsersService.addNewUser(data)
    }
    @MessagePattern('login_user')
    async loginUser({email, password}) {
        return this.databaseUsersService.loginUser(email, password)
    }
    @MessagePattern('delete_user')
    async deleteUser({id}) {
        return this.databaseUsersService.deleteUser(id)
    }
}
