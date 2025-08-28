import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { databaseClient } from 'src/database.client';
import { VerifyService } from 'src/verify/verify.service';


@Injectable()
export class LoginService {
    constructor(private verifyService: VerifyService) { }
    async loginUser() {
        const userData = await this.verifyService.getUserData();
        const loginUser = await lastValueFrom(databaseClient.send('login_user', userData))
        const token = loginUser && await this.verifyService.generateToken({
            id: loginUser?.id,
            email: loginUser?.email,
            role: [loginUser?.role]
        })
        return {
            userData: loginUser,
            token: token
        }
    }

    async setUserData(userData) {
        await this.verifyService.setUserData(userData);
    }

    async sendCode() {
        await this.verifyService.sendVerificationCode();
    }

    async confirmLogin(code: string) {
        const verified = await this.verifyService.veryfyCode(code);
        if (!verified.success) {
            return { success: false, message: 'Невірний код' };
        }

        const userData = this.verifyService.getUserData();
        if (!userData) {
            throw new HttpException('Дані користувача не знайдені', HttpStatus.BAD_REQUEST);
        }

        const success = await lastValueFrom(
            databaseClient.send('login_user', userData)
        );

        if (!success) {
            throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }

        return { 
            success: true,
        };
    }
}
