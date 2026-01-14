# 📚 Repository Pattern - SOLID Architecture

## Огляд

Цей проект реалізує **Generic Repository Pattern** з підтримкою **SOLID принципів**:

- **S** - Single Responsibility - кожен клас має одну відповідальність
- **O** - Open/Closed - відкритий для розширення, закритий для модифікації
- **L** - Liskov Substitution - підставляються без збоїв
- **I** - Interface Segregation - малі, специфічні інтерфейси
- **D** - Dependency Inversion - залежність від абстракцій

## 📁 Структура

```
repositories/
├── core/
│   ├── types.ts                      # Основні типи
│   ├── base-repository.interface.ts  # IBaseRepository контракт
│   ├── base-repository.abstract.ts   # BaseRepository реалізація
│   ├── query-builder.ts              # QueryBuilder для гнучких запитів
│   ├── error-handler.ts              # Обробка помилок
│   └── index.ts                      # Експорти
├── user.repository.ts                # Специфічний репозиторій користувача
├── product.repository.ts             # Специфічний репозиторій продуктів
├── order/
│   └── order-base.repository.ts      # Специфічний репозиторій замовлень
├── products-analytics/
│   └── baseProductsAnalytics.handler.ts  # Специфічний репозиторій аналітики
└── index.ts                          # Головні експорти
```

## 🎯 Основні інтерфейси

### IBaseRepository<T>

```typescript
interface IBaseRepository<T> {
  // Пошук
  findById(id: EntityId, options?: IQueryOptions): Promise<T | null>;
  find(filter: IQueryFilter, options?: IQueryOptions): Promise<T[]>;
  findAll(options?: IQueryOptions): Promise<T[]>;
  findOne(filter: IQueryFilter, options?: IQueryOptions): Promise<T | null>;
  findPaginated(filter: IQueryFilter, options?: IQueryOptions): Promise<IPaginatedResult<T>>;

  // Створення
  create(data: ICreateInput<T>): Promise<T>;
  createMany(data: ICreateInput<T>[]): Promise<T[]>;

  // Оновлення
  updateById(id: EntityId, data: IUpdateInput<T>): Promise<T>;
  update(filter: IQueryFilter, data: IUpdateInput<T>): Promise<T[]>;

  // Видалення
  deleteById(id: EntityId): Promise<void>;
  delete(filter: IQueryFilter): Promise<number>;

  // Утиліти
  exists(filter: IQueryFilter): Promise<boolean>;
  count(filter?: IQueryFilter): Promise<number>;
}
```

## 💡 Приклади використання

### 1. Пошук користувача

```typescript
// Простий пошук
const user = await userRepository.findById('user-123');

// З параметрами
const user = await userRepository.findOne(
  { email: 'user@example.com' },
  {
    select: {
      id: true,
      name: true,
      email: true,
      // password виключається
    }
  }
);

// Специфічний метод репозиторію
const user = await userRepository.findByEmail('user@example.com');

// Безпечна версія (без паролю)
const user = await userRepository.findByIdSafe('user-123');
```

### 2. Створення користувача

```typescript
const newUser = await userRepository.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'secure-password', // автоматично хешується
  role: 'user'
});
```

### 3. Оновлення користувача

```typescript
const updatedUser = await userRepository.updateById('user-123', {
  name: 'Jane Doe',
  email: 'jane@example.com'
  // password буде хешований при оновленні
});
```

### 4. Пошук продуктів з фільтрами

```typescript
// Все продукти з атрибутами
const products = await productRepository.findAllWithAttributes();

// З сортуванням та пагінацією
const paginatedProducts = await productRepository.findPaginated(
  { discount: { gt: 0 } }, // Prisma фільтр - продукти зі знижкою
  {
    orderBy: { price: 'desc' },
    pagination: { limit: 10, page: 1 }
  }
);

// Пошук за прикладом імені
const products = await productRepository.findByName('Nike Air');
```

### 5. Робота з замовленнями

```typescript
// Створення замовлення з товарами
const order = await orderRepository.create({
  userId: 'user-123',
  total: 299.99,
  deliveryMethod: 'Кур\'єр', // або 'Courier'
  address: 'вул. Крещатик, 1',
  email: 'user@example.com',
  items: [
    { productId: 'prod-1', quantity: 2, price: 50 },
    { productId: 'prod-2', quantity: 1, price: 199.99 }
  ]
});

// Пошук замовлення з товарами
const order = await orderRepository.findByIdWithItems('order-123');

// Усі замовлення користувача
const userOrders = await orderRepository.findByUserId('user-123');

// Замовлення за статусом
const pendingOrders = await orderRepository.findByStatus('pending');

// Оновлення статусу
const updated = await orderRepository.updateStatus('order-123', 'shipped');

// Статистика
const stats = await orderRepository.getStatistics({
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  status: 'completed'
});
```

### 6. Аналітика продуктів

```typescript
// Створення запису аналітики
const analytics = await analyticsRepository.create({
  productId: 'prod-123',
  views: 100,
  clicks: 25,
  orders: 5
});

// Оновлення метрик взаємодії
await analyticsRepository.updateEngagementMetrics('prod-123', {
  views: 10,  // додати 10 до views
  clicks: 2   // додати 2 до clicks
});

// Оновлення рейтинг метрик
await analyticsRepository.updateRatingMetrics('prod-123', {
  reviews: 5,
  maxRating: 4.8,
  minRating: 3.2
});

// Збільшити конкретну метрику
await analyticsRepository.incrementMetric('prod-123', 'views', 1);

// Топ продукти за переглядами
const topProducts = await analyticsRepository.getTopProductsByMetric('views', 10);
```

### 7. QueryBuilder - динамічні запити

```typescript
import { QueryBuilder } from '@repositories/core';

const query = new QueryBuilder()
  .addFilters({ 
    price: { gte: 50, lte: 500 },
    discount: { gt: 0 }
  })
  .select({ id: true, name: true, price: true })
  .include({ attributes: true })
  .orderBy('price', 'desc')
  .pagination(20, 0)
  .build();

const products = await productRepository.find(query.filters, {
  ...query
});
```

### 8. Обробка помилок

```typescript
import { RepositoryError, EntityNotFoundError, EntityAlreadyExistsError } from '@repositories/core';

try {
  const user = await userRepository.create({
    name: 'John',
    email: 'john@example.com',
    password: 'pass'
  });
} catch (error) {
  if (error instanceof EntityAlreadyExistsError) {
    console.log(`Користувач з ${error.field} вже існує`);
  } else if (error instanceof RepositoryError) {
    console.log(`Помилка БД: ${error.message} (${error.code})`);
  }
}
```

## 🏗️ Розширення репозиторію

Щоб створити новий репозиторій:

```typescript
import { BaseRepository } from '@repositories/core';
import { PrismaService } from '../../prisma.service';
import { Review } from '@prisma/client';

export interface ICreateReviewInput {
  productId: string;
  userId: string;
  rating: number;
  comment: string;
}

@Injectable()
export class ReviewRepository extends BaseRepository<Review> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected getModel(): any {
    return this.prisma.reviews;
  }

  // Додавайте специфічні методи за потребою
  async findByProduct(productId: string): Promise<Review[]> {
    return this.find({ productId });
  }

  async findByUser(userId: string): Promise<Review[]> {
    return this.find({ userId });
  }
}
```

## 📊 Типи запитів

### IQueryOptions

```typescript
interface IQueryOptions {
  select?: Record<string, boolean>;           // Вибір полів
  include?: Record<string, any>;              // Включення відносин
  orderBy?: Record<string, 'asc' | 'desc'>;  // Сортування
  pagination?: {
    limit: number;
    page?: number;
    cursor?: string;                         // Cursor-based pagination
  };
}
```

### IPaginatedResult

```typescript
interface IPaginatedResult<T> {
  data: T[];
  meta: {
    total: number;        // Загальна кількість
    page: number;         // Поточна сторінка
    limit: number;        // Елементів на сторінці
    hasMore: boolean;     // Є ще сторінки
    cursor?: string;      // Для cursor pagination
  };
}
```

## ⚡ Переваги архітектури

✅ **DRY** - уникаємо повторення коду  
✅ **SOLID** - дотримуємось 5 принципів  
✅ **Testable** - легко писати unit-тести  
✅ **Maintainable** - легко розширювати  
✅ **Type-safe** - повна підтримка TypeScript  
✅ **Flexible** - QueryBuilder для складних запитів  
✅ **Centralized Error Handling** - єдина обробка помилок  

## 🔄 Migration Guide

### Старий код:
```typescript
async findByEmail(email: string) {
  const user = await this.prisma.user.findFirst({ where: { email } });
  if (!user) throw new NotFoundException(...);
  return user;
}
```

### Новий код:
```typescript
async findByEmail(email: string): Promise<User | null> {
  return this.findOne({ email });
}
```

## 📝 Примітки

- Всі методи повертають `Promise`, що дозволяє асинхронне виконання
- Помилки Prisma автоматично обробляються та маппяться на RepositoryError
- Специфічні репозиторії розширюють BaseRepository та додають власну логіку
- QueryBuilder забезпечує гнучкість при складних запитах
