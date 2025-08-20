import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterUserDTO } from '../dto/register-user.dto';
import { Request, Response, NextFunction } from 'express';
import { VerifyService } from 'src/verify/verify.service';

@Controller('fashion')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) { }

    @Post('register/init')
    async initRegistration(@Body() userData: RegisterUserDTO) {
        try {
            console.log(userData.email)
            await this.registerService.setUserData(userData);
            await this.registerService.sendCode();
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: 'Помилка при ініціалізації реєстрації',
                error: error.message || 'Невідома помилка(',
            };
        }
    }

    @Post('register/confirm')
    async confirmRegistration(@Body() body: { code: string }) {
        try {
            const result = await this.registerService.confirmRegistration(body.code);
            console.log(JSON.stringify(result))
            return JSON.stringify(result);
        } catch (error) {
            return {
                success: false,
                message: 'Помилка підтвердження коду',
                error: error.message || 'Невідома помилка',
            };
        }
    }

}
