import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  authFlowSchema,
  authSuccessSchema,
} from '@packages/shared/common/swagger/response-schemas';
import { LoginService } from './login.service';
import { LoginUserDTO } from '../dto/login-user.dto';

@ApiTags('Auth')
@Controller('fashion')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login/init')
  @ApiOperation({ summary: 'Start login flow with OTP confirmation' })
  @ApiOkResponse({ description: 'Login flow started', schema: authFlowSchema })
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
  @ApiOperation({ summary: 'Confirm login flow with OTP code' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['flowId', 'code'],
      properties: {
        flowId: { type: 'string', example: 'login-flow-123' },
        code: { type: 'string', example: '123456' },
      },
    },
  })
  @ApiOkResponse({ description: 'Login confirmed', schema: authSuccessSchema })
  async confirmLogin(@Body() body: { flowId: string; code: string }) {
    if (!body.code || !body.flowId) {
      throw new HttpException('flowId and code are required', HttpStatus.BAD_REQUEST);
    }

    return this.loginService.confirmLogin(body.flowId, body.code);
  }
}
