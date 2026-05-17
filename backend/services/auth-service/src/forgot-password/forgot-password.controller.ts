import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ForgotPasswordService } from './forgot-password.service';

@ApiTags('Auth')
@Controller('fashion')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post('forgot-password/init')
  async initResetPassword(@Body() body: { email: string; newPassword: string }) {
    try {
      return await this.forgotPasswordService.initResetPassword(body.email, body.newPassword);
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || 'Password reset initialization failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('forgot-password/confirm')
  async confirmResetPassword(@Body() body: { flowId: string; code: string }) {
    try {
      if (!body.code || !body.flowId) {
        throw new HttpException('flowId and code are required', HttpStatus.BAD_REQUEST);
      }
      return await this.forgotPasswordService.confirmResetPassword(body.flowId, body.code);
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || 'Password reset confirmation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
