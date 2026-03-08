import { Body, Controller, Get, Post } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleCredentialDTO } from '../dto/google-credential.dto';

@Controller('fashion/google')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get('clientid')
  getClientId() {
    return this.googleAuthService.getClientId();
  }

  @Post('auth')
  authWithGoogle(@Body() credentialResponse: GoogleCredentialDTO) {
    return this.googleAuthService.authWithGoogle(credentialResponse);
  }
}
