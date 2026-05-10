import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  authFlowSchema,
  authSuccessSchema,
} from '@packages/shared/common/swagger/response-schemas';
import { RegisterService } from './register.service';
import { RegisterUserDTO } from '../dto/register-user.dto';

@ApiTags('Auth')
@Controller('fashion')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('register/init')
  @ApiOperation({ summary: 'Start registration flow with OTP confirmation' })
  @ApiOkResponse({ description: 'Registration flow started', schema: authFlowSchema })
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
  @ApiOperation({ summary: 'Confirm registration flow with OTP code' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['flowId', 'code'],
      properties: {
        flowId: { type: 'string', example: 'register-flow-123' },
        code: { type: 'string', example: '123456' },
      },
    },
  })
  @ApiOkResponse({ description: 'Registration confirmed', schema: authSuccessSchema })
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
