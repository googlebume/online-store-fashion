import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { AuthEventMiddleware } from 'src/middlewares/authEventMiddleware';
import { AuthFieldsLengthMiddleware } from 'src/middlewares/authFieldsLangth.middleware';

@Module({
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthFieldsLengthMiddleware, AuthEventMiddleware)
        .forRoutes('fashion/auth');
    }
}
