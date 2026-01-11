import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginUserDTO } from '../dto/login-user.dto';

@Controller('fashion')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login/init')
  async initLogin(@Body() userData: LoginUserDTO) {
    await this.loginService.setUserData(userData);
    await this.loginService.sendCode();
    return { success: true };
  }

  @Post('login/confirm')
  async confirmLogin(@Body() body: { code: string }) {
    if (!body.code) {
      throw new HttpException('Код обовʼязковий', HttpStatus.BAD_REQUEST);
    }

    const result = await this.loginService.confirmLoginAndLogin(body.code);

    return {
      success: true,
      ...result,
    };
  }
}
