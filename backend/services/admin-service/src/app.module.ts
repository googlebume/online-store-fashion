import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { ProductsModule } from './products/products.module';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { OrdersModule } from './orders/orders.module';
import { OrdersService } from './orders/orders.service';
import { APP_GUARD } from '@nestjs/core';

import { JwtAuthGuard } from '@packages/shared/common/guards/jwt-auth.guard';
import { RolesGuard } from '@packages/shared/common/guards/roles.guard';

import { JwtModule } from '@nestjs/jwt';
import { registerJwt, basePipline } from '@packages/config/dist/register-jwt'

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    OrdersModule,
    JwtModule.register(
      registerJwt(basePipline)
    ),
  ],
  providers: [
    UsersService,
    ProductsService,
    OrdersService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
