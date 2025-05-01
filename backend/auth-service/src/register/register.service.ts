import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { databaseClient } from 'src/database.client';


@Injectable()
export class RegisterService {
    async getUserData(userData) {
        const data = userData;
        const isRegistered = await lastValueFrom(databaseClient.send('get_user_by_email', userData.email))
        if(isRegistered) {
            console.log('Вже зареєстрований')
            throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }
        await lastValueFrom(databaseClient.send('add_new_user', userData))
    }
}
