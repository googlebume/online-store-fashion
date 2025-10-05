import { forwardRef, Module } from '@nestjs/common';
import { VerifyService } from './verify.service';
import { VerifyController } from './verify.controller';
import { RegisterModule } from 'src/register/register.module';
import { MailerHandlerModule } from '@packages/shared/dist/src/utils/libs/mailer/mailer.module'

@Module({
  controllers: [VerifyController],
  providers: [VerifyService,],
  imports: [forwardRef(() => RegisterModule), MailerHandlerModule],
  exports: [VerifyService],
})
export class VerifyModule {}
