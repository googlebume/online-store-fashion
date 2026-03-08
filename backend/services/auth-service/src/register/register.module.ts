import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { AuthCoreModule } from '../auth-core/auth-core.module';

@Module({
  controllers: [RegisterController],
  providers: [RegisterService],
  imports: [AuthCoreModule],
  exports: [RegisterService],
})
export class RegisterModule {}
