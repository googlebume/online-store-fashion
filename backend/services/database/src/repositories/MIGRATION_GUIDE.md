# 🔄 Migration Guide - Старий код → Новий код (SOLID/Repository Pattern)

## Як мігрувати існуючий код

### ❌ Старий паттерн

```typescript
// user.repository.ts - ПОГАНО
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByID(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async addNewUser(data: { name: string; email: string; password: string }) {
    try {
      await this.prisma.user.create({ data });
      return true;
    } catch (err) {
      if (err.code === 'P2002') return false;
      throw new Error(`Error: ${err.message}`);
    }
  }
}

// database-users.service.ts - ПОГАНО
@Injectable()
export class DatabaseUsersService {
  constructor(private userRepository: UserRepository) {}

  async getUserByID(id: string) {
    return this.userRepository.findByID(id);
  }

  async addNewUser(data) {
    return this.userRepository.addNewUser(data);
  }
}

// database-users.controller.ts - ПОГАНО
@Controller()
export class DatabaseUsersController {
  @MessagePattern('get_user_by_id')
  async getUserByID(data: { id: string }) {
    return this.databaseUsersService.getUserByID(data.id);
  }
}
```

**Проблеми:**
- ❌ Немає централізованої обробки помилок
- ❌ HTTP винятки мішаються з бізнес-логікою
- ❌ Немає типізації вводу/виводу
- ❌ Дублювання логіки в різних репозиторіях
- ❌ Важко розширювати базовий функціонал
- ❌ Немає стандартного відповіді формату

### ✅ Новий паттерн

```typescript
// core/types.ts
export interface IBaseRepository<T> {
  findById(id: EntityId): Promise<T | null>;
  find(filter: IQueryFilter): Promise<T[]>;
  create(data: ICreateInput<T>): Promise<T>;
  updateById(id: EntityId, data: IUpdateInput<T>): Promise<T>;
  deleteById(id: EntityId): Promise<void>;
}

// repositories/user.repository.ts - ДОБРЕ
@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(private prisma: PrismaService) {
    super();
  }

  protected getModel() {
    return this.prisma.user;
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.findOne({ email });
    } catch (error) {
      ErrorHandler.handleError(error, 'User');
    }
  }

  async create(data: ICreateUserInput): Promise<User> {
    try {
      const hashedPassword = await this.hashPassword(data.password);
      return await this.prisma.user.create({
        data: { ...data, password: hashedPassword }
      });
    } catch (error) {
      ErrorHandler.handleError(error, 'User');
    }
  }
}

// database-users.service.ts - ДОБРЕ
@Injectable()
export class DatabaseUsersService {
  constructor(private userRepository: UserRepository) {}

  async getUserByID(id: string) {
    return this.userRepository.findById(id);
  }

  async addNewUser(data: ICreateUserInput) {
    try {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        return {
          success: false,
          message: 'User already exists'
        };
      }
      const newUser = await this.userRepository.create(data);
      return {
        success: true,
        message: 'User created',
        user: newUser
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}

// database-users.controller.ts - ДОБРЕ
@Controller()
export class DatabaseUsersController {
  constructor(private databaseUsersService: DatabaseUsersService) {}

  @MessagePattern('get_user_by_id')
  async getUserByID(@Payload() data: { id: string }) {
    try {
      const user = await this.databaseUsersService.getUserByID(data.id);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @MessagePattern('add_new_user')
  async addNewUser(@Payload() data: any) {
    return this.databaseUsersService.addNewUser(data);
  }
}
```

**Переваги:**
- ✅ Централізована обробка помилок через `ErrorHandler`
- ✅ Структурована відповідь `{ success, message, data }`
- ✅ Типізація через `ICreateUserInput`
- ✅ `BaseRepository` забезпечує базовий функціонал
- ✅ Легко розширювати специфічні методи
- ✅ Clear separation of concerns (SoC)

---

## Крок за кроком

### Крок 1: Розширити BaseRepository

```typescript
// БУЛО:
class UserRepository {
  constructor(private prisma: PrismaService) {}
  
  async findById(id: string) { ... }
}

// СТАЛО:
class UserRepository extends BaseRepository<User> {
  constructor(private prisma: PrismaService) {
    super();
  }
  
  protected getModel(): any {
    return this.prisma.user;
  }
}
```

### Крок 2: Видалити дублювання методів

```typescript
// БУЛО: кожен репозиторій реалізував свої findById, findMany, тощо
// СТАЛО: наслідують з BaseRepository, який має усі базові методи
```

### Крок 3: Типізувати вхід/вихід

```typescript
// БУЛО:
async addNewUser(data: { name: string; email: string; password: string }) { ... }

// СТАЛО:
async create(data: ICreateUserInput): Promise<User> { ... }

// ICreateUserInput повинен розширювати ICreateInput<User>
export interface ICreateUserInput extends ICreateInput<User> {
  name: string;
  email: string;
  password: string;
}
```

### Крок 4: Централізувати обробку помилок

```typescript
// БУЛО:
try {
  await this.prisma.user.create({ data });
  return true;
} catch (err) {
  if (err.code === 'P2002') return false;
  throw new Error(`Error: ${err.message}`);
}

// СТАЛО:
try {
  return await this.prisma.user.create({ data });
} catch (error) {
  ErrorHandler.handleError(error, 'User');
}
```

### Крок 5: Структурувати відповідь сервісу

```typescript
// БУЛО:
return this.repository.findById(id);

// СТАЛО:
try {
  const user = await this.repository.findById(id);
  return {
    success: true,
    data: user
  };
} catch (error) {
  return {
    success: false,
    message: error.message
  };
}
```

### Крок 6: Додати обробку помилок в контролер

```typescript
// БУЛО:
@MessagePattern('get_user_by_id')
async getUserByID(data: { id: string }) {
  return this.databaseUsersService.getUserByID(data.id);
}

// СТАЛО:
@MessagePattern('get_user_by_id')
async getUserByID(@Payload() data: { id: string }) {
  try {
    const user = await this.databaseUsersService.getUserByID(data.id);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
```

---

## Відповідність старих методів новим

| Старий метод | Новий еквівалент | Рівень |
|---|---|---|
| `findById(id)` | `findById(id)` | BaseRepository |
| `findByEmail(email)` | `findOne({ email })` | BaseRepository |
| `findAll()` | `findAll()` | BaseRepository |
| `findByName(name)` | спеціальний метод | Конкретний репозиторій |
| `create(data)` | `create(data)` | BaseRepository |
| `update(data)` | `updateById(id, data)` | BaseRepository |
| `delete(id)` | `deleteById(id)` | BaseRepository |
| `count()` | `count(filter)` | BaseRepository |
| `exists(filter)` | `exists(filter)` | BaseRepository |
| `findPaginated()` | `findPaginated(filter, options)` | BaseRepository |

---

## Приклади миграції конкретних репозиторіїв

### ProductRepository

**БУЛО:**
```typescript
async findAll() {
  const products = await this.prisma.products.findMany();
  const attributes = await this.prisma.attributes.findMany();
  
  const combined = products.map(product => {
    const matchingAttribute = attributes.find(attr => attr.productsId === product.id);
    return {
      ...product,
      attributes: this.changeArrToObj(matchingAttribute)
    };
  });
  return combined;
}

async dynamicallyLoad(take: number, page: number, cursor?: string) {
  const _take = Math.max(1, take);
  const baseQuery = { ... };
  // ручне управління пагінацією
}
```

**СТАЛО:**
```typescript
async findAllWithAttributes(options?: IQueryOptions) {
  return this.findAll({
    ...options,
    include: { attributes: true }
  });
}

async findPaginated(filter, options) {
  return BaseRepository.findPaginated(filter, {
    ...options,
    pagination: { limit: take, page }
  });
}
```

### OrderRepository

**БУЛО:**
```typescript
async findById(id: string): Promise<Order> {
  const order = await this.prisma.order.findUnique({ where: { id } });
  if (!order) {
    throw new HttpException("Order not found", HttpStatus.NOT_FOUND);
  }
  return order;
}

async add(data: OrderDTO) {
  try {
    const order = await this.prisma.order.create({ data: { ... } });
    return {
      success: true,
      message: "Order created",
      orderId: order.id
    };
  } catch (error) {
    throw new HttpException("...", HttpStatus.BAD_REQUEST);
  }
}
```

**СТАЛО:**
```typescript
async findByIdWithItems(id: string) {
  return this.findById(id, {
    include: { items: true }
  });
}

override async create(data: ICreateOrderInput): Promise<Order> {
  try {
    return await this.prisma.order.create({
      data: { ... },
      include: { items: true }
    });
  } catch (error) {
    ErrorHandler.handleError(error, 'Order');
  }
}
```

---

## Чек-лист для миграції

### Для кожного репозиторію:
- [ ] Розширює `BaseRepository<T>`
- [ ] Реалізує `protected getModel()`
- [ ] Видалені дублювання методів (використовуються базові)
- [ ] Специфічні методи типізовані
- [ ] Помилки обробляються через `ErrorHandler`
- [ ] Налаштовані типи вхід/виходу (`ICreateInput`, `IUpdateInput`)

### Для кожного сервісу:
- [ ] Має конструктор з репозиторієм
- [ ] Повертає структуровану відповідь `{ success, message, data }`
- [ ] Обробляє помилки репозиторію
- [ ] Містить бізнес-логіку (не прямої делегації)

### Для кожного контролера:
- [ ] Користується `@MessagePattern` для мікросервісів
- [ ] Має `@Payload()` для параметрів
- [ ] Обробляє помилки та повертає структуровану відповідь
- [ ] Делегує до сервісу (не безпосередньо до репозиторію)

---

## Q&A

**Q: Що робити з методами, що залишилися в старому коді?**  
A: Вони можуть залишитися, але слід перепаковувати як через `BaseRepository` методи або видалити, якщо вже є базові.

**Q: Як обробляти складні запити?**  
A: Використовуйте `QueryBuilder` або додайте специфічні методи в конкретному репозиторіїв.

**Q: Чи потрібно мати окремий интерфейс для кожного репозиторію?**  
A: Нi, достатньо `IBaseRepository<T>`. Специфічні методи можна описувати в документації.

**Q: Як писати тести?**  
A: Мокуйте репозиторій на рівні сервісу і обов'язково обробляйте помилки.
