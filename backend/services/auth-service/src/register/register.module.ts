import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { AuthFieldsLengthMiddleware } from 'src/common/middlewares/authFieldsLangth.middleware';
import { VerifyService } from 'src/verify/verify.service';
import { VerifyModule } from 'src/verify/verify.module';

@Module({
  controllers: [RegisterController],
  providers: [RegisterService],
  imports: [forwardRef(() => VerifyModule)]
})
export class RegisterModule {
  
}
