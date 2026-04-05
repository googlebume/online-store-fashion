import { Module } from '@nestjs/common';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';
import { VerifyModule } from './verify/verify.module';

import { JwtModule } from '@nestjs/jwt';
// import { registerJwt, basePipline } from '@packages/config/dist/register-jwt'
import { registerJwt, basePipline } from '@packages/config/dist/register-jwt'
import { GoogleAuthModule } from './google-auth/google-auth.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    RegisterModule,
    LoginModule,
    VerifyModule,
    JwtModule.register(
      registerJwt(basePipline)
    ),
    GoogleAuthModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
