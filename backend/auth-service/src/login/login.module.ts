import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
// import { AuthEventMiddleware } from 'src/middlewares/authEventMiddleware';

@Module({
  controllers: [LoginController],
  providers: [LoginService,],
})
export class LoginModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(AuthEventMiddleware)
  //     .forRoutes('fashion/auth');
  // }
}
