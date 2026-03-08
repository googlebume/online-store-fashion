import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { AuthCoreModule } from '../auth-core/auth-core.module';

@Module({
  controllers: [LoginController],
  providers: [LoginService],
  imports: [AuthCoreModule],
  exports: [LoginService],
})
export class LoginModule {}
