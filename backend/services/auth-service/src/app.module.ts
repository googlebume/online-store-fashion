import { Module } from '@nestjs/common';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { RegisterService } from './register/register.service';
import { VerifyModule } from './verify/verify.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    RegisterModule,
    LoginModule,
    VerifyModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET || 'SECRET',
      signOptions: {
        expiresIn: '24h'
      }
    })
  ],
  controllers: [],
  providers: [

  ],
})
export class AppModule { }
