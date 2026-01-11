import { forwardRef, Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { VerifyModule } from '../verify/verify.module';
import { DatabaseClientProvider } from '../interfaces/database-client.provider';

/**
 * Login Module
 * SOLID Principle: Dependency Inversion
 * Provides dependencies through interfaces
 */
@Module({
  controllers: [LoginController],
  providers: [LoginService, DatabaseClientProvider],
  imports: [forwardRef(() => VerifyModule)],
  exports: [LoginService],
})
export class LoginModule {}
