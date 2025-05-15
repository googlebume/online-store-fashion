import { Controller, Post, Body, Res } from '@nestjs/common';
import { LoginService } from './login.service';
import { Response, Request, NextFunction } from 'express';
import { LoginUserDTO } from 'src/dto/login-user.dto';
import { lastValueFrom } from 'rxjs';
import { databaseClient } from 'src/database.client';

@Controller('fashion')
export class LoginController {
    constructor(private readonly loginService: LoginService) { }

    // @Post('login')
    // async loginUser(@Body() loginData: LoginUserDTO, @Res() res: Response) {
    //   console.log('LoginController.loginUser called with:', loginData);
    //   const { email, password } = loginData;

    //   try {
    //     const userData = await this.loginService.loginUser(email, password);
    //     return res.status(200).json({
    //       success: true,
    //       userData,
    //     });
    //   } catch (error) {
    //     console.error('Помилка при авторизації:', error);
    //     return res.status(401).json({
    //       success: false,
    //       message: 'Помилка при авторизації',
    //       error: error.message,
    //     });
    //   }
    // }
    @Post('login/init')
    async initLogin(@Body() userData: LoginUserDTO) {
        try {
            console.log("            ", userData.email)
            await this.loginService.setUserData(userData);
            await this.loginService.sendCode();
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: 'Помилка при ініціалізації логування',
                error: error.message || 'Невідома помилка',
            };
        }
    }

    @Post('login/confirm')
    async confirmRegistration(@Body() body: { code: string }) {
        try {
            const result = await this.loginService.confirmLogin(body.code);
            console.log(JSON.stringify(result))
            const userData = await this.loginService.loginUser();
            console.log(userData)
            return {
                success: true,
                ...userData,
            }
        } catch (error) {
            return {
                success: false,
                message: 'Помилка підтвердження коду',
                error: error.message || 'Невідома помилка',
            };
        }
    }
}