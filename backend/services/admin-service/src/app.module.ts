import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { ProductsModule } from './products/products.module';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@packages/shared/dist/common/guards/jwt-auth.guard';
import { RolesGuard } from '@packages/shared/dist/common/guards/roles.guard';

import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    JwtModule.register({
      secret: 'SECRET',
      signOptions: { expiresIn: '24h' },
    }),
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
