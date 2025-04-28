import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { AuthEventMiddleware } from 'src/middlewares/authEventMiddleware';

@Module({
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthEventMiddleware)
        .forRoutes('fashion/auth');
    }
}
