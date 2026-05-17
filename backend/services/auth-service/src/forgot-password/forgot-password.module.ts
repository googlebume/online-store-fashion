import { Module } from '@nestjs/common';
import { AuthCoreModule } from '../auth-core/auth-core.module';
import { ForgotPasswordController } from './forgot-password.controller';
import { ForgotPasswordService } from './forgot-password.service';

@Module({
  imports: [AuthCoreModule],
  controllers: [ForgotPasswordController],
  providers: [ForgotPasswordService],
})
export class ForgotPasswordModule {}
