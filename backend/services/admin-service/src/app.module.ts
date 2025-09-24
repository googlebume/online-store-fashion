import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { ProductsModule } from './products/products.module';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { APP_GUARD } from '@nestjs/core';

//ТИМЧАСОВО
import { JwtAuthGuard } from 'D:/projects/online-store-fashion/backend/packages/shared/dist/common/guards/jwt-auth.guard';
import { RolesGuard } from 'D:/projects/online-store-fashion/backend/packages/shared/dist/common/guards/roles.guard';
// import { JwtAuthGuard } from '@packages/shared/dist/common/guards/jwt-auth.guard';
// import { RolesGuard } from '@packages/shared/dist/common/guards/roles.guard';

import { JwtModule } from '@nestjs/jwt';
import { registerJwt, basePipline } from '@packages/config/dist/register-jwt'
// import { registerJwt, basePipline } from 'D:/projects/online-store-fashion/backend/packages/config/dist/register-jwt'

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    JwtModule.register(
      registerJwt(basePipline)
    ),
  ],
  providers: [
    UsersService,
    ProductsService,
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
