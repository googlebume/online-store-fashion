import { Controller, Post, Body, Res } from '@nestjs/common';
import { LoginService } from './login.service';
import { Response, Request, NextFunction } from 'express';
import { LoginUserDTO } from 'src/dto/login-user.dto';
import { lastValueFrom } from 'rxjs';
import { databaseClient } from 'src/database.client';

@Controller('fashion')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('auth')
  async loginUser(@Body() loginData: LoginUserDTO, @Res() res: Response) {
    console.log('LoginController.loginUser called with:', loginData);
    const { email, password } = loginData;

    try {
      const userData = await this.loginService.loginUser(email, password);
      return res.status(200).json({
        success: true,
        userData,
      });
    } catch (error) {
      console.error('Помилка при авторизації:', error);
      return res.status(401).json({
        success: false,
        message: 'Помилка при авторизації',
        error: error.message,
      });
    }
  }

  static async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body; // Витягуємо email і password
      console.log('LoginController.handle called with:', { email, password }); // Лог для дебагінгу

      // Викликаємо мікросервіс напряму
      const result = await lastValueFrom(
        databaseClient.send('login_user', { email, password })
      );

      if (!result) {
        return res.status(401).json({
          success: false,
          message: 'Користувача не знайдено або невірний пароль',
        });
      }

      return res.status(200).json({ success: true, userData: result });
    } catch (error) {
      console.error('Помилка при логуванні:', error);
      return res.status(401).json({
        success: false,
        error: error.message || 'Помилка авторизації',
      });
    }
  }
}