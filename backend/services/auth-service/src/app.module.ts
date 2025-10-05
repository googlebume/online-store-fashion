import { Module } from '@nestjs/common';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';
import { VerifyModule } from './verify/verify.module';
// import { MailerHandlerModule } from '../../../packages/shared/dist/src/utils/libs/mailer/'
// import { MailerHandlerModule } from '@packages/shared/dist/src/utils/libs/mailer/mailer.module'

import { JwtModule } from '@nestjs/jwt';
// import { registerJwt, basePipline } from '@packages/config/dist/register-jwt'
import { registerJwt, basePipline } from '@packages/config/dist/register-jwt'

@Module({
  imports: [
    RegisterModule,
    LoginModule,
    VerifyModule,
    // MailerHandlerModule,
    JwtModule.register(
      registerJwt(basePipline)
    )
  ],
  controllers: [],
  providers: [

  ],
})
export class AppModule { }

