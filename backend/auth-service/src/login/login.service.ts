import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { databaseClient } from 'src/database.client';


@Injectable()
export class LoginService {
    async loginUser(email, password) {
        return await lastValueFrom(databaseClient.send('login_user', {password, email}))
    }
}
