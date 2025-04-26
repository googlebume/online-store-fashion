import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { Request, Response, NextFunction } from 'express';

@Controller('fashion')
export class LoginController {
    constructor(private readonly loginService: LoginService) {}

    // @Post('auth/login')
    // async hello(@Body() body: any) {
    //     return await this.loginService.hello(body);
    // }

    // === ДОДАНИЙ СТАТИЧНИЙ МЕТОД ДЛЯ middleware ===
    // static async handle(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const loginService = new LoginService();
    //         const result = await loginService.hello(req.body);
    //         res.json(result);
    //     } catch (error) {
    //         next(error);
    //     }
    // }
}

