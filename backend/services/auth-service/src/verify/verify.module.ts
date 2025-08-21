import { forwardRef, Module } from '@nestjs/common';
import { VerifyService } from './verify.service';
import { VerifyController } from './verify.controller';
import { RegisterModule } from 'src/register/register.module';

@Module({
  controllers: [VerifyController],
  providers: [VerifyService],
  imports: [forwardRef(() => RegisterModule)],
  exports: [VerifyService],
})
export class VerifyModule {}
