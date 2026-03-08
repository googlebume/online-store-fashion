import { Module } from '@nestjs/common';
import { MailerHandlerModule } from '@packages/shared/dist/src/utils/libs/mailer/mailer.module';
import { OtpService } from './otp.service';
import { TokenService } from './token.service';
import { UserIdentityService } from './user-identity.service';
import { DatabaseClientProvider } from '../interfaces/database-client.provider';

@Module({
  imports: [MailerHandlerModule],
  providers: [OtpService, TokenService, UserIdentityService, DatabaseClientProvider],
  exports: [OtpService, TokenService, UserIdentityService],
})
export class AuthCoreModule {}
