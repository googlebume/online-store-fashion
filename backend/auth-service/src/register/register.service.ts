import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { databaseClient } from 'src/database.client';


@Injectable()
export class RegisterService {
    async getUserData(userData) {
        const success = await lastValueFrom(databaseClient.send('add_new_user', userData));
        if (!success) {
            throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }
        return success;

    }
}
