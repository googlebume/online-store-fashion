import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { VerifyModule } from 'src/verify/verify.module';

@Module({
  controllers: [LoginController],
  providers: [LoginService],
  imports: [
    forwardRef(() => VerifyModule)
  ]
})
export class LoginModule {

}
