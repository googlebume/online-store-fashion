import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { databaseClient } from 'src/database.client';
import * as bcrypt from 'bcryptjs';
import { VerifyService } from 'src/verify/verify.service';

@Injectable()
export class RegisterService {
    constructor(private verifyService: VerifyService) { }

    async setUserData(userData) {
        await this.verifyService.setUserData(userData);
    }

    async sendCode() {
        await this.verifyService.sendVerificationCode();
    }

    async confirmRegistration(code: string) {
        const verified = await this.verifyService.veryfyCode(code);
        if (!verified.success) {
            return { success: false, message: 'Невірний код' };
        }

        const userData = this.verifyService.getUserData();
        if (!userData) {
            throw new HttpException('Дані користувача не знайдені', HttpStatus.BAD_REQUEST);
        }


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

        return { success: true };
    }


    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
}