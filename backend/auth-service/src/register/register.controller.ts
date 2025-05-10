import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterUserDTO } from '../dto/register-user.dto';
import { Request, Response, NextFunction } from 'express';
import { VerifyService } from 'src/verify/verify.service';

@Controller('fashion')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) {}

    @Post('auth')
    async getUserData(@Body() userData: RegisterUserDTO) {
        try {
            return await this.registerService.getUserData(userData);
        } catch (error) {
            if (error instanceof HttpException) {
                return {
                    success: false,
                    message: error.message,
                    error: error.message
                };
            }
            return {
                success: false,
                message: 'Помилка при реєстрації',
                error: error.message || 'Невідома помилка'
            };
        }
    }

    static async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const verifyService = new VerifyService();
            const registerService = new RegisterService(verifyService);
            
            try {
                const result = await registerService.getUserData(req.body);
                
                res.json({
                    success: true,
                    result
                });
            } catch (error) {
                console.error('Помилка при реєстрації:', error);
                
                return res.status(200).json({
                    success: false,
                    message: error.message || 'Помилка при реєстрації користувача',
                    error: error.message || 'Невідома помилка'
                });
            }
        } catch (error) {
            console.error('Критична помилка:', error);
            return res.status(200).json({
                success: false,
                message: 'Помилка серверу',
                error: 'Server error'
            });
        }
    }
}