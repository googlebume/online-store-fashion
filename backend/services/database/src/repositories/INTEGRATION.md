# 🔗 Інтеграція Репозиторіїв з Контролерами та Сервісами

## Архітектурна схема

```
┌─────────────────────────────────────────────────────────────────┐
│                      Microservice Controller                     │
│         (MessagePattern для inter-service communication)         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Service Layer                               │
│  (Бізнес-логіка, валідація, трансформація даних)               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Repository Layer                            │
│   (Доступ до БД через Prisma, управління даними)               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Database (Prisma)                           │
│                   SQLite / PostgreSQL                            │
└─────────────────────────────────────────────────────────────────┘
```

## 3-рівнева архітектура

### 1️⃣ Рівень контролера (Controller Layer)

**Відповідальність**: Отримання повідомлень від мікросервісів та делегування до сервісу

```typescript
@Controller('database-users')
export class DatabaseUsersController {
  constructor(private readonly databaseUsersService: DatabaseUsersService) {}

  @MessagePattern('get_user_by_id')
  async getUserByID(@Payload() data: { id: string }) {
    try {
      const user = await this.databaseUsersService.getUserByID(data.id);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
```

**Ключові моменти:**
- ✅ Використовує `@MessagePattern` для мікросервісної комунікації
- ✅ Делегує всю логіку до сервісу
- ✅ Обробляє помилки та повертає структуровану відповідь
- ✅ Не містить бізнес-логіки
- ✅ Має `@Payload()` для явної інжекції параметрів

### 2️⃣ Рівень сервісу (Service Layer)

**Відповідальність**: Бізнес-логіка, валідація, координація репозиторіїв

```typescript
@Injectable()
export class DatabaseUsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserByID(id: string) {
    return this.userRepository.findById(id);
  }

  async loginUser(email: string, password: string) {
    const user = await this.userRepository.authenticate(email, password);
    
    if (!user) {
      return {
        success: false,
        message: 'Invalid credentials'
      };
    }

    return {
      success: true,
      message: 'Login successful',
      user: await this.userRepository.findByIdSafe(user.id)
    };
  }
}
```

**Ключові моменти:**
- ✅ Інжектує репозиторій через конструктор
- ✅ Містить бізнес-логіку (валідацію, трансформацію)
- ✅ Обробляє специфічні для домену операції
- ✅ Повертає структуровану відповідь з статусом успіху

### 3️⃣ Рівень репозиторію (Repository Layer)

**Відповідальність**: Доступ до даних, взаємодія з БД

```typescript
@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected getModel(): any {
    return this.prisma.user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }

  async authenticate(email: string, password: string): Promise<User | null> {
    const user = await this.findOne({ email });
    if (!user) return null;
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }
}
```

**Ключові моменти:**
- ✅ Розширяє `BaseRepository<T>`
- ✅ Реалізує `protected getModel()`
- ✅ Має специфічні для сутності методи
- ✅ Відповідає лише за доступ до БД
- ✅ Обробляє помилки через `ErrorHandler`

## Приклади потоків даних

### Приклад 1: Отримання користувача

```
Запит від іншого мікросервісу:
  MessagePattern('get_user_by_id') → { id: 'user-123' }
                ↓
DatabaseUsersController.getUserByID()
  ↓ (делегує)
DatabaseUsersService.getUserByID(id)
  ↓ (делегує)
UserRepository.findById(id)
  ↓ (Prisma запит)
Prisma.user.findUnique({ where: { id } })
  ↓
БД (SQLite/PostgreSQL)
  ↓
{ id: 'user-123', name: 'John', email: 'john@example.com', ... }
  ↓ (повертається через стеки)
{ success: true, data: { ... } }
```

### Приклад 2: Створення користувача

```
Запит від іншого мікросервісу:
  MessagePattern('add_new_user') → { name, email, password }
                ↓
DatabaseUsersController.addNewUser()
  ↓ (делегує)
DatabaseUsersService.addNewUser(data)
  ├─ Проверяет існування користувача
  │   UserRepository.findByEmail(email)
  │   ↓ Prisma.user.findFirst({ where: { email } })
  │
  └─ Якщо не існує:
      UserRepository.create(data)
        ├─ Хешує пароль (bcryptjs)
        └─ Prisma.user.create({ data: { ...data, password: hashedPassword } })
          ↓
          БД
          ↓
        { success: true, message: '...', user: { ... } }
```

### Приклад 3: Отримання продуктів з пагінацією

```
Запит:
  MessagePattern('get_products_dynamically') → { take: 20, page: 1 }
                ↓
DatabaseProductsController.getDynamicallyLoadedProducts()
  ↓
DatabaseProductsService.getPaginatedProducts(20, 1)
  ↓
ProductRepository.findPaginated(
  {},
  {
    pagination: { limit: 20, page: 1 },
    include: { attributes: true },
    orderBy: { createdAt: 'desc' }
  }
)
  ├─ Prisma.products.findMany(...)
  └─ Prisma.products.count(...)
    ↓
    БД
    ↓
  {
    data: [...],
    meta: { total: 150, page: 1, limit: 20, hasMore: true }
  }
```

## Залежності в модулі

```typescript
@Module({
  // Імпортуємо репозиторіїв модуль
  imports: [RepositoriesModule],
  
  controllers: [
    DatabaseUsersController,
    DatabaseProductsController,
    DatabaseOrdersController,
    DatabaseAnalyticsController
  ],
  
  providers: [
    DatabaseUsersService,
    DatabaseProductsService,
    DatabaseOrdersService,
    DatabaseAnalyticsService
  ]
})
export class DatabaseModule {}
```

## Мікросервісна комунікація

Усі контролери мають відповідні `@MessagePattern`:

### Users:
- `get_all_users` - отримати всіх користувачів
- `get_user_by_id` - отримати користувача по ID
- `get_user_by_email` - отримати користувача по email
- `add_new_user` - створити нового користувача
- `login_user` - автентифікація
- `delete_user` - видалити користувача
- `update_user` - оновити користувача

### Products:
- `get_products` - усі продукти
- `get_products_dynamically` - з пагінацією
- `get_product_by_id` - по ID
- `get_product_by_name` - по назві
- `add_product` - створити продукт
- `edit_product` - оновити продукт
- `delete_product_by_id` - видалити продукт
- `save_product_image` - завантажити зображення
- `edit_image` - оновити зображення

### Orders:
- `get_order_by_id` - отримати замовлення
- `add_order` - створити замовлення
- `get_user_orders` - замовлення користувача
- `get_all_orders` - усі замовлення
- `update_order_status` - оновити статус
- `get_orders_by_status` - фільтр за статусом
- `delete_order` - видалити замовлення
- `get_order_statistics` - статистика

### Analytics:
- `get_product_analytics_by_id` - аналітика продукту
- `create-metrics-record` - створити запис
- `update-engagement-metrics` - оновити метрики взаємодії
- `update-rating-metrics` - оновити рейтинг метрики
- `increment-metric` - збільшити метрику
- `get-top-products` - топ продукти
- `get-analytics-with-product` - аналітика з продуктом

## Правила для нових функцій

### Як додати нову операцію:

1. **Додайте метод в репозиторій**:
```typescript
// UserRepository
async findByRole(role: string): Promise<User[]> {
  return this.find({ role });
}
```

2. **Додайте метод в сервіс**:
```typescript
// DatabaseUsersService
async getUsersByRole(role: string) {
  try {
    const users = await this.userRepository.findByRole(role);
    return { success: true, data: users };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
```

3. **Додайте метод в контролер**:
```typescript
// DatabaseUsersController
@MessagePattern('get_users_by_role')
async getUsersByRole(@Payload() data: { role: string }) {
  return this.databaseUsersService.getUsersByRole(data.role);
}
```

## Обробка помилок

Всі помилки обробляються на рівні репозиторію через `ErrorHandler`:

```typescript
// В репозиторії
try {
  return await this.prisma.user.create({ data });
} catch (error) {
  ErrorHandler.handleError(error, 'User');
}

// ErrorHandler конвертує помилки Prisma:
// P2002 → EntityAlreadyExistsError (409)
// P2025 → EntityNotFoundError (404)
// інші → DatabaseError (500)
```

На рівні сервісу всі помилки вловлюються та повертаються в структурованому форматі:

```typescript
{
  success: false,
  message: 'Описання помилки'
}
```

На рівні контролера помилки теж обробляються та повертаються в мікросервіс:

```typescript
try {
  return { success: true, data: ... };
} catch (error) {
  return { success: false, message: error.message };
}
```

## Типізація

Усе типізовано через TypeScript інтерфейси:

```typescript
// В репозиторіях
export interface ICreateUserInput extends ICreateInput<User> {
  name: string;
  email: string;
  password: string;
  role?: string;
}

// У сервісах
async addNewUser(data: ICreateUserInput) {
  // TypeScript перевірить типи
}

// У контролерах
async addNewUser(@Payload() data: any) {
  // На runtime масив параметрів, але типи перевіряються у сервісі
}
```

## Тестування

Легко писати unit-тести через залежність інжекції:

```typescript
describe('UserService', () => {
  let service: DatabaseUsersService;
  let mockRepository: jest.Mock;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn()
    };
    
    service = new DatabaseUsersService(mockRepository as any);
  });

  it('should return user', async () => {
    mockRepository.findById.mockResolvedValue({ id: '123', name: 'John' });
    
    const result = await service.getUserByID('123');
    
    expect(result).toEqual({ id: '123', name: 'John' });
  });
});
```

## Переваги такої архітектури

✅ **Чистий код** - кожен шар має одну відповідальність  
✅ **Легко тестувати** - залежності інжектуються  
✅ **Легко розширювати** - додавайте нові методи без змін інших  
✅ **Централізована обробка помилок** - `ErrorHandler`  
✅ **Мікросервісна сумісність** - `MessagePattern` працює коректно  
✅ **Типова безпека** - весь код типізований  
✅ **DRY принцип** - базовий функціонал в `BaseRepository`  
✅ **SOLID** - усі 5 принципів дотримуються
