import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { VerifyService } from 'src/verify/verify.service';
// import { AuthEventMiddleware } from 'src/middlewares/authEventMiddleware';

@Module({
  controllers: [LoginController],
  providers: [LoginService, VerifyService],
})
export class LoginModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(AuthEventMiddleware)
  //     .forRoutes('fashion/auth');
  // }
}
