import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { databaseClient } from 'src/database.client';

@Injectable()
export class UsersService {
    async getAllUsers(): Promise<object[]> {
        const allUsers = await lastValueFrom(databaseClient.send("get_all_users", {}))
        return allUsers;
    }
}
