import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { AuthEventMiddleware } from 'src/middlewares/authEventMiddleware';
import { AuthFieldsLengthMiddleware } from 'src/middlewares/authFieldsLangth.middleware';
import { VerifyService } from 'src/verify/verify.service';

@Module({
  controllers: [RegisterController],
  providers: [RegisterService, VerifyService],
})
export class RegisterModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthEventMiddleware)
        .forRoutes('fashion/auth');
    }
}
