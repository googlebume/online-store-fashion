// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { lastValueFrom } from 'rxjs';
// import { databaseClient } from 'src/database.client';


// @Injectable()
// export class RegisterService {
//     async getUserData(userData) {
//         const success = await lastValueFrom(databaseClient.send('add_new_user', userData));
//         if (!success) {
//             throw new HttpException('User already exists', HttpStatus.CONFLICT);
//         }
//         return success;

//     }
// }

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { databaseClient } from 'src/database.client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RegisterService {
    async getUserData(userData) {
        const hashedPassword = await this.hashPassword(userData.password);
        const userDataWithHashedPassword = {
            ...userData,
            password: hashedPassword,
        };

        const success = await lastValueFrom(
            databaseClient.send('add_new_user', userDataWithHashedPassword)
        );

        if (!success) {
            throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }

        return success;
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
}
