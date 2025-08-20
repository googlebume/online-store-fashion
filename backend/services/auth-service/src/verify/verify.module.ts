import { forwardRef, Module } from '@nestjs/common';
import { VerifyService } from './verify.service';
import { VerifyController } from './verify.controller';
import { RegisterModule } from 'src/register/register.module';

@Module({
  controllers: [VerifyController],
  providers: [VerifyService],
  imports: [forwardRef(() => RegisterModule)], // якщо є циклічна залежність
  exports: [VerifyService], // експортуємо сервіс, а не модуль
})
export class VerifyModule {}
