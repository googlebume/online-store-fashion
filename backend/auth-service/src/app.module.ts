import { Module } from '@nestjs/common';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { RegisterService } from './register/register.service';


@Module({
  imports: [RegisterModule, LoginModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
