import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginUserDTO } from '../dto/login-user.dto';

@Controller('fashion')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login/init')
  async initLogin(@Body() userData: LoginUserDTO) {
    try {
      return await this.loginService.initLogin(userData);
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Login initialization failed',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login/confirm')
  async confirmLogin(@Body() body: { flowId: string; code: string }) {
    if (!body.code || !body.flowId) {
      throw new HttpException('flowId and code are required', HttpStatus.BAD_REQUEST);
    }

    return this.loginService.confirmLogin(body.flowId, body.code);
  }
}
