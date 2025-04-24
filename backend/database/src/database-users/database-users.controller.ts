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
    async getUserByID(data: { id: number }) {
        return this.databaseUsersService.getUserByID(data.id)
    }
    @MessagePattern('add_new_user')
    async addNewUser(data){
        return this.databaseUsersService.addNewUser(data)
    }
}
