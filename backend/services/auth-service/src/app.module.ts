import { Module } from '@nestjs/common';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { RegisterService } from './register/register.service';
import { VerifyModule } from './verify/verify.module';
import { JwtModule } from '@nestjs/jwt';
import registerJwt from '@packages/config/dist/register-jwt'

const jwtPipeline = {
  global: true,
  secret: process.env.SECRET || 'SECRET',
  signOptions: {
    expiresIn: '24h'
  }
}

@Module({
  imports: [
    RegisterModule,
    LoginModule,
    VerifyModule,
    JwtModule.register(
      registerJwt(jwtPipeline)
    )
  ],
  controllers: [],
  providers: [

  ],
})
export class AppModule { }

