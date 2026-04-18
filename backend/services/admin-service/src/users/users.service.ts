import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { databaseClient } from './../database.client';

@Injectable()
export class UsersService {
    async getAllUsers(): Promise<object[]> {
        const allUsers: any[] = await lastValueFrom(databaseClient.send("get_all_users", {}))
        return allUsers;
    }
    async deleteUser(id: string):Promise<object> {
        const deleteUser = await lastValueFrom(databaseClient.send('delete_user', {id: id}))
        return deleteUser
    }
}
