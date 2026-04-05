import { Module } from '@nestjs/common';
import { OrderingModule } from './ordering/ordering.module';
import { JwtModule } from '@nestjs/jwt';
import { basePipline, registerJwt } from '@packages/config/dist/register-jwt';

@Module({
  imports: [
    OrderingModule,
    JwtModule.register(registerJwt(basePipline)),
  ],
  controllers: [],
  providers: [],
})
export class OrderModule { }
