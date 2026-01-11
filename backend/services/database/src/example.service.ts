import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { ProductRepository } from './repositories/product.repository';
import { OrderBaseHandler } from './repositories/order/order-base.repository';
import { ProductsAnalyticsRepository } from './repositories/products-analytics/baseProductsAnalytics.handler';

/**
 * Приклад сервісу, що використовує репозиторії
 * SOLID Principle: Single Responsibility - сервіс має бізнес-логіку,
 * репозиторій - доступ до даних
 */
@Injectable()
export class AppService {
  constructor(
    private userRepository: UserRepository,
    private productRepository: ProductRepository,
    private orderRepository: OrderBaseHandler,
    private analyticsRepository: ProductsAnalyticsRepository
  ) {}

  /**
   * Приклад: Реєстрація користувача
   */
  async registerUser(data: {
    name: string;
    email: string;
    password: string;
  }) {
    // Перевіримо, чи користувач вже існує
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Користувач з таким email уже існує');
    }

    // Створимо нового користувача
    return this.userRepository.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'user',
    });
  }

  /**
   * Приклад: Автентифікація користувача
   */
  async loginUser(email: string, password: string) {
    const user = await this.userRepository.authenticate(email, password);

    if (!user) {
      throw new Error('Невірні облікові дані');
    }

    return this.userRepository.findByIdSafe(user.id);
  }

  /**
   * Приклад: Отримання каталогу продуктів
   */
  async getCatalog(page: number = 1, limit: number = 20) {
    return this.productRepository.findPaginated(
      {}, // без фільтрів
      {
        pagination: { page, limit },
        orderBy: { createdAt: 'desc' },
        include: { attributes: true },
      }
    );
  }

  /**
   * Приклад: Пошук продуктів зі знижкою
   */
  async getDiscountedProducts(minDiscount: number = 10) {
    return this.productRepository.find(
      { discount: { gte: minDiscount } },
      {
        orderBy: { discount: 'desc' },
        include: { attributes: true },
      }
    );
  }

  /**
   * Приклад: Оформлення замовлення
   */
  async createOrder(userId: string, data: any) {
    // Якщо користувач авторизований, пов'яжемо замовлення з його акаунтом
    if (userId) {
      const user = await this.userRepository.findByIdSafe(userId);
      if (!user) {
        throw new Error('Користувач не знайдений');
      }
    }

    // Створимо замовлення
    const order = await this.orderRepository.create({
      userId: userId || undefined,
      total: data.total,
      deliveryMethod: data.deliveryMethod,
      address: data.address,
      email: data.email,
      status: 'pending',
      items: data.items,
    });

    // Оновимо аналітику для кожного продукту
    for (const item of data.items) {
      await this.analyticsRepository.incrementMetric(
        item.productId,
        'orders',
        item.quantity
      );
    }

    return order;
  }

  /**
   * Приклад: Отримання аналітики продукту
   */
  async getProductAnalytics(productId: string) {
    const product = await this.productRepository.findByIdWithAttributes(
      productId
    );

    if (!product) {
      throw new Error('Продукт не знайдений');
    }

    const analytics = await this.analyticsRepository.findWithProduct(
      productId
    );

    return {
      product,
      analytics,
    };
  }

  /**
   * Приклад: Топ продуктів за переглядами
   */
  async getTopProducts(limit: number = 10) {
    const topAnalytics = await this.analyticsRepository.getTopProductsByMetric(
      'views',
      limit
    );

    // Отримаємо повну інформацію про продукти
    const products = await Promise.all(
      topAnalytics.map(analytics =>
        this.productRepository.findByIdWithAttributes(analytics.productId)
      )
    );

    return products.map((product, index) => ({
      product,
      analytics: topAnalytics[index],
    }));
  }

  /**
   * Приклад: Отримання статистики замовлень
   */
  async getOrdersStatistics(filters?: {
    startDate?: Date;
    endDate?: Date;
    status?: string;
  }) {
    return this.orderRepository.getStatistics(filters);
  }

  /**
   * Приклад: Оновлення статусу замовлення
   */
  async updateOrderStatus(orderId: string, status: string) {
    return this.orderRepository.updateStatus(orderId, status);
  }

  /**
   * Приклад: Видалення продукту
   */
  async deleteProduct(productId: string) {
    // Видалимо аналітику
    const analytics = await this.analyticsRepository.findByProductId(
      productId
    );
    if (analytics) {
      await this.analyticsRepository.deleteById(analytics.id);
    }

    // Видалимо продукт (з очисткою зображення)
    await this.productRepository.deleteById(productId);

    return { success: true, message: 'Продукт видалений' };
  }
}
