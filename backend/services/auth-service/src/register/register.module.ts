import { forwardRef, Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { VerifyModule } from '../verify/verify.module';
import { DatabaseClientProvider } from '../interfaces/database-client.provider';

/**
 * Register Module
 * SOLID Principle: Dependency Inversion
 * Provides dependencies through interfaces
 */
@Module({
  controllers: [RegisterController],
  providers: [RegisterService, DatabaseClientProvider],
  imports: [forwardRef(() => VerifyModule)],
  exports: [RegisterService],
})
export class RegisterModule {}
