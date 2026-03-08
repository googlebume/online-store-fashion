import { Module } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthController } from './google-auth.controller';
import { AuthCoreModule } from '../auth-core/auth-core.module';

@Module({
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService],
  imports: [AuthCoreModule],
})
export class GoogleAuthModule {}
