import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterUserDTO } from '../dto/register-user.dto';

@Controller('fashion')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('register/init')
  async initRegistration(@Body() userData: RegisterUserDTO) {
    try {
      return await this.registerService.initRegistration(userData);
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Registration initialization failed',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('register/confirm')
  async confirmRegistration(@Body() body: { flowId: string; code: string }) {
    try {
      if (!body.code || !body.flowId) {
        throw new HttpException('flowId and code are required', HttpStatus.BAD_REQUEST);
      }

      return await this.registerService.confirmRegistration(body.flowId, body.code);
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Registration confirmation failed',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
