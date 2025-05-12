import { Module } from '@nestjs/common';
import { VerifyService } from './verify.service';
import { VerifyController } from './verify.controller';
import { RegisterService } from 'src/register/register.service';

@Module({
  controllers: [VerifyController],
  providers: [VerifyService, RegisterService],
})
export class VerifyModule {}
