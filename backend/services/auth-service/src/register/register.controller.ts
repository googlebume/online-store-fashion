import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterUserDTO } from '../dto/register-user.dto';

/**
 * Register Controller
 * SOLID Principle: Single Responsibility
 * Handles HTTP requests for user registration
 */
@Controller('fashion')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('register/init')
  async initRegistration(@Body() userData: RegisterUserDTO) {
    try {
      await this.registerService.setUserData(userData);
      await this.registerService.sendCode();
      return { success: true };
    } catch (error) {
      throw new HttpException(
        error.message || 'Помилка при ініціалізації реєстрації',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('register/confirm')
  async confirmRegistration(@Body() body: { code: string }) {
    try {
      if (!body.code || typeof body.code !== 'string') {
        throw new HttpException('Код підтвердження обов\'язковий', HttpStatus.BAD_REQUEST);
      }

      const result = await this.registerService.confirmRegistration(body.code);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Помилка підтвердження коду',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
