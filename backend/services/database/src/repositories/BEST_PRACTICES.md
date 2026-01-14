# 🎯 Best Practices - Repository Pattern & SOLID

## 1️⃣ Single Responsibility Principle (SRP)

✅ **Правильно**: Репозиторій має лише операції з БД

```typescript
@Injectable()
export class UserRepository extends BaseRepository<User> {
  // ✅ ДОБРЕ: тільки операції з БД
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }

  async create(data: ICreateUserInput): Promise<User> {
    const hashedPassword = await this.hashPassword(data.password);
    return this.prisma.user.create({ data: { ...data, password: hashedPassword } });
  }
}
```

❌ **Неправильно**: Змішування логіки

```typescript
// ❌ ПОГАНО: бізнес-логіка в репозиторії
async registerUser(data) {
  // Валідація
  if (!this.isValidEmail(data.email)) throw new Error(...);
  
  // JWT генерація
  const token = this.jwtService.sign(...);
  
  // Email відправка
  await this.emailService.send(...);
  
  // БД операція
  return this.prisma.user.create(...);
}
```

---

## 2️⃣ Open/Closed Principle (OCP)

✅ **Правильно**: Розширення без модифікації

```typescript
// BaseRepository - закритий для модифікації
export abstract class BaseRepository<T> implements IBaseRepository<T> {
  async find(filter: IQueryFilter, options?: IQueryOptions): Promise<T[]> {
    return this.getModel().findMany({
      where: filter,
      ...this.buildQueryOptions(options),
    });
  }
}

// UserRepository - розширюємо без змін до базової
@Injectable()
export class UserRepository extends BaseRepository<User> {
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email }); // Використовуємо базові методи
  }

  async authenticate(email: string, password: string): Promise<User | null> {
    // Специфічна логіка побудована на базових методах
    const user = await this.findOne({ email });
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
}
```

❌ **Неправильно**: Модифікація базового класу

```typescript
// ❌ ПОГАНО: змінюємо базовий клас для кожного репозиторію
export abstract class BaseRepository<T> {
  async find(filter) { /* ... */ }
  async authenticate(email, password) { /* ... */ }  // Не має бути тут!
  async generateToken() { /* ... */ }                 // Не має бути тут!
  async sendEmail() { /* ... */ }                     // Не має бути тут!
}
```

---

## 3️⃣ Liskov Substitution Principle (LSP)

✅ **Правильно**: Підклас можна використовувати замість батька

```typescript
// Контракт
interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  create(data: any): Promise<T>;
}

// Базовий клас
abstract class BaseRepository<T> implements IRepository<T> {
  abstract getModel(): any;
  
  async findById(id: string): Promise<T | null> {
    return this.getModel().findUnique({ where: { id } });
  }

  async create(data: any): Promise<T> {
    return this.getModel().create({ data });
  }
}

// Будь-який підклас можна використовувати замість BaseRepository
const repo: BaseRepository<User> = new UserRepository(prisma);
const user = await repo.findById('123'); // ✅ Працює коректно

const productRepo: BaseRepository<Product> = new ProductRepository(prisma);
const product = await productRepo.findById('456'); // ✅ Працює коректно
```

❌ **Неправильно**: Порушення контракту

```typescript
// ❌ ПОГАНО: UserRepository має інший сигнатур
class UserRepository extends BaseRepository<User> {
  async findById(userId: string): Promise<User | null> {
    // Очікується (id: string), але приймаємо userId - порушення LSP
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async create(userData: any, options?: any): Promise<User> {
    // Очікується (data: any), але має options - порушення LSP
    if (options?.skipValidation) {
      // ...
    }
    return this.prisma.user.create({ data: userData });
  }
}
```

---

## 4️⃣ Interface Segregation Principle (ISP)

✅ **Правильно**: Малі, специфічні інтерфейси

```typescript
// Малі інтерфейси
export interface IReadRepository<T> {
  findById(id: EntityId): Promise<T | null>;
  find(filter: IQueryFilter): Promise<T[]>;
}

export interface IWriteRepository<T> {
  create(data: ICreateInput<T>): Promise<T>;
  updateById(id: EntityId, data: IUpdateInput<T>): Promise<T>;
  deleteById(id: EntityId): Promise<void>;
}

// Клієнт використовує тільки потрібний інтерфейс
@Injectable()
export class UserService {
  constructor(
    private userRead: IReadRepository<User>,    // Тільки читання
    private userWrite: IWriteRepository<User>   // Тільки запис
  ) {}
}

// Або комбінований
export interface IRepository<T> 
  extends IReadRepository<T>, IWriteRepository<T> {}
```

❌ **Неправильно**: Великий монолітний інтерфейс

```typescript
// ❌ ПОГАНО: Великий інтерфейс
interface IUserRepository {
  findById(...): Promise<User>;
  findAll(...): Promise<User[]>;
  create(...): Promise<User>;
  update(...): Promise<User>;
  delete(...): Promise<void>;
  authenticate(...): Promise<User>;
  hashPassword(...): Promise<string>;
  sendEmail(...): Promise<void>;
  generateToken(...): Promise<string>;
  validateEmail(...): boolean;
  // ... багато інших методів
}

// Сервіс залежить від всього, навіть якщо використовує 2-3 методи
class UserService implements IUserRepository {
  // Мусимо реалізувати всі методи
}
```

---

## 5️⃣ Dependency Inversion Principle (DIP)

✅ **Правильно**: Залежність від абстракцій

```typescript
// Абстракція
export interface IBaseRepository<T> {
  findById(id: EntityId): Promise<T | null>;
  create(data: ICreateInput<T>): Promise<T>;
  updateById(id: EntityId, data: IUpdateInput<T>): Promise<T>;
  deleteById(id: EntityId): Promise<void>;
}

// Сервіс залежить від інтерфейсу
@Injectable()
export class UserService {
  constructor(
    private userRepository: IBaseRepository<User> // залежність від абстракції
  ) {}

  async getUser(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}

// Реалізація інтерфейсу
@Injectable()
export class UserRepository extends BaseRepository<User> 
  implements IBaseRepository<User> {
  // ...
}

// В модулі
@Module({
  providers: [
    UserService,
    UserRepository,
    {
      provide: IBaseRepository,
      useClass: UserRepository
    }
  ]
})
export class UserModule {}
```

❌ **Неправильно**: Залежність від конкретної реалізації

```typescript
// ❌ ПОГАНО: Залежність від конкретного класу
@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository // залежність від конкретизації
  ) {}
}

// Важко тестувати, важко мокувати
// У тестах мусимо використовувати реальну UserRepository
```

---

## 6️⃣ Інші Best Practices

### Error Handling

✅ **Правильно**: Централізована обробка помилок

```typescript
// В репозиторії
async findById(id: string): Promise<User | null> {
  try {
    return await this.prisma.user.findUnique({ where: { id } });
  } catch (error) {
    ErrorHandler.handleError(error, 'User'); // Централізована обробка
  }
}

// Custom помилки
try {
  await userRepository.create({ email: 'test@test.com', ... });
} catch (error) {
  if (error instanceof EntityAlreadyExistsError) {
    // Специфічна обробка
  }
}
```

### Type Safety

✅ **Правильно**: Типи для вводу/виводу

```typescript
// Специфічні типи для створення
export interface ICreateUserInput extends ICreateInput<User> {
  name: string;
  email: string;
  password: string;
}

// Типи для оновлення (все опціонально)
export interface IUpdateUserInput extends IUpdateInput<User> {
  name?: string;
  email?: string;
  password?: string;
}

// Використання
const newUser = await userRepository.create({
  name: 'John',
  email: 'john@example.com',
  password: 'secure'
} as ICreateUserInput);

// TypeScript підкаже помилки
const invalid = await userRepository.create({
  unknownField: 'value' // ❌ Помилка типу
});
```

### Query Optimization

✅ **Правильно**: Вибір потрібних полів

```typescript
// Отримуємо тільки потрібні поля
const users = await userRepository.findAll({
  select: {
    id: true,
    name: true,
    email: true
    // password не буде завантажено
  }
});

// З відносинами
const products = await productRepository.find({}, {
  include: {
    attributes: true,
    reviews: {
      select: {
        rating: true,
        comment: true
      }
    }
  }
});
```

### Pagination

✅ **Правильно**: Пагінація для великих наборів

```typescript
const paginatedProducts = await productRepository.findPaginated(
  { discount: { gt: 0 } },
  {
    pagination: {
      limit: 20,
      page: 1
    },
    orderBy: { createdAt: 'desc' }
  }
);

console.log(paginatedProducts.data);      // Продукти
console.log(paginatedProducts.meta.total); // Загальна кількість
console.log(paginatedProducts.meta.hasMore); // Є ще сторінки?
```

---

## 📋 Checklist для нового Репозиторію

- [ ] Розширяє `BaseRepository<T>`
- [ ] Реалізує `IBaseRepository<T>`
- [ ] Має `protected getModel()` метод
- [ ] Специфічні методи виділені в окремі public методи
- [ ] Помилки обробляються через `ErrorHandler`
- [ ] Типи вводу/виводу визначені (`ICreateInput`, `IUpdateInput`)
- [ ] Документовані методи (JSDoc comments)
- [ ] Проведені unit-тести
- [ ] Зареєстрований у `RepositoriesModule`
