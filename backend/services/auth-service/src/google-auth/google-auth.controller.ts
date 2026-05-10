import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GoogleAuthService } from './google-auth.service';
import { GoogleCredentialDTO } from '../dto/google-credential.dto';
import {
  googleAuthResponseSchema,
  googleClientIdSchema,
} from '@packages/shared/common/swagger/response-schemas';

@ApiTags('Google Auth')
@Controller('fashion/google')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get('clientid')
  @ApiOperation({ summary: 'Get Google OAuth client id for frontend sign-in' })
  @ApiOkResponse({ description: 'Google OAuth client id', schema: googleClientIdSchema })
  getClientId() {
    return this.googleAuthService.getClientId();
  }

  @Post('auth')
  @ApiOperation({ summary: 'Authenticate or register user using Google credential response' })
  @ApiOkResponse({ description: 'Google auth result', schema: googleAuthResponseSchema })
  authWithGoogle(@Body() credentialResponse: GoogleCredentialDTO) {
    return this.googleAuthService.authWithGoogle(credentialResponse);
  }
}
