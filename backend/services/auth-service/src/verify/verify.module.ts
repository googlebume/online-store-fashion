import { Module } from '@nestjs/common';
import { VerifyController } from './verify.controller';
import { AuthCoreModule } from '../auth-core/auth-core.module';

@Module({
  controllers: [VerifyController],
  imports: [AuthCoreModule],
})
export class VerifyModule {}
