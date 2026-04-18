import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateUserHandler } from '../../application/user/handlers/create-user.handler';
import { LoginUserHandler } from '../../application/user/handlers/login-user.handler';
import { GetUserByIdHandler } from '../../application/user/handlers/get-user-by-id.handler';
import { GetUserByEmailHandler } from '../../application/user/handlers/get-user-by-email.handler';
import { GetAllUsersHandler } from '../../application/user/handlers/get-all-users.handler';
import { UpdateUserHandler } from '../../application/user/handlers/update-user.handler';
import { DeleteUserHandler } from '../../application/user/handlers/delete-user.handler';
import { PrismaUserRepository } from '../../infrastructure/user/repositories/prisma-user.repository';
import { BcryptPasswordHasherAdapter } from '../../infrastructure/shared/adapters/bcrypt-password-hasher.adapter';
import { PrismaService } from '../../infrastructure/shared/prisma/prisma.service';
import { USER_REPOSITORY_PORT } from '../../domain/user/ports/user-repository.port';
import { PASSWORD_HASHER_PORT } from '../../application/ports/password-hasher.port';

@Module({
  controllers: [UserController],
  providers: [
    PrismaService,
    CreateUserHandler,
    LoginUserHandler,
    GetUserByIdHandler,
    GetUserByEmailHandler,
    GetAllUsersHandler,
    UpdateUserHandler,
    DeleteUserHandler,
    BcryptPasswordHasherAdapter,
    {
      provide: USER_REPOSITORY_PORT,
      useClass: PrismaUserRepository,
    },
    {
      provide: PASSWORD_HASHER_PORT,
      useClass: BcryptPasswordHasherAdapter,
    },
  ],
  exports: [USER_REPOSITORY_PORT],
})
export class UserModule {}
