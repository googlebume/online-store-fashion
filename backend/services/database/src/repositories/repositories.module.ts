import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ImageFileHandler } from '@packages/shared/dist/utils/libs/files/image-file.handler';

// Import all repositories
import { UserRepository } from './user.repository';
import { ProductRepository } from './product.repository';
import { OrderBaseHandler } from './order/order-base.repository';
import { ProductsAnalyticsRepository } from './products-analytics/baseProductsAnalytics.handler';

/**
 * RepositoriesModule - SOLID Principle: Dependency Injection
 * Централізований модуль для реєстрації всіх репозиторіїв
 * 
 * Використання в інших модулях:
 * 
 * @Module({
 *   imports: [RepositoriesModule],
 *   controllers: [UserController],
 *   providers: [UserService]
 * })
 * export class UserModule {}
 * 
 * 
 * У сервісі:
 * 
 * @Injectable()
 * export class UserService {
 *   constructor(private userRepository: UserRepository) {}
 * 
 *   async getUser(id: string) {
 *     return this.userRepository.findById(id);
 *   }
 * }
 */
@Module({
  providers: [
    PrismaService,
    ImageFileHandler,
    UserRepository,
    ProductRepository,
    OrderBaseHandler,
    ProductsAnalyticsRepository,
  ],
  exports: [
    PrismaService,
    ImageFileHandler,
    UserRepository,
    ProductRepository,
    OrderBaseHandler,
    ProductsAnalyticsRepository,
  ],
})
export class RepositoriesModule {}
