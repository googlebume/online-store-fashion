import { Module } from '@nestjs/common';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { RegisterService } from './register/register.service';
import { VerifyModule } from './verify/verify.module';


@Module({
  imports: [RegisterModule, LoginModule, VerifyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
