import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { databaseClient } from 'src/database.client';


@Injectable()
export class RegisterService {
    async getUserData(userData) {
        const data = userData;
        await lastValueFrom(databaseClient.send('add_new_user', userData))
    }
}
