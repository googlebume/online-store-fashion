import { Module } from '@nestjs/common';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';
import { VerifyModule } from './verify/verify.module';

import { JwtModule } from '@nestjs/jwt';
// import { registerJwt, basePipline } from '@packages/config/dist/register-jwt'
import { registerJwt, basePipline } from '@packages/config/dist/register-jwt'

@Module({
  imports: [
    RegisterModule,
    LoginModule,
    VerifyModule,
    JwtModule.register(
      registerJwt(basePipline)
    )
  ],
  controllers: [],
  providers: [

  ],
})
export class AppModule { }

