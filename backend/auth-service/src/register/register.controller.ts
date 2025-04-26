import { Controller, Post, Body } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterUserDTO } from '../dto/register-user.dto';
import { Request, Response, NextFunction } from 'express';

@Controller('fashion')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) {}

    @Post('auth')
    async getUserData(@Body() userData: RegisterUserDTO) {
        return await this.registerService.getUserData(userData);
    }


    static async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const registerService = new RegisterService();
            const result = await registerService.getUserData(req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}
