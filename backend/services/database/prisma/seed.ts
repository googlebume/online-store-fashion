import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
  }),
});

interface BackupData {
  users: any[];
  products: any[];
  attributes: any[];
  baskets: any[];
  orderedProducts: any[];
  orders: any[];
  reviews: any[];
}

async function main() {
  console.log('🌱 Завантаження seed даних...');
  
  // Спробувати знайти backup файл
  const backupDir = path.join(process.cwd(), 'prisma', 'backup');
  let data: BackupData | null = null;
  
  if (fs.existsSync(backupDir)) {
    // Спочатку шукаємо latest-backup.json
    const latestBackupPath = path.join(backupDir, 'latest-backup.json');
    
    if (fs.existsSync(latestBackupPath)) {
      console.log('📂 Використовую latest-backup.json');
      data = await JSON.parse(fs.readFileSync(latestBackupPath, 'utf8'));
    } else {
      const backupFiles = fs.readdirSync(backupDir)
        .filter(file => file.startsWith('database-backup-') && file.endsWith('.json'))
        .sort()
        .reverse();
      
      if (backupFiles.length > 0) {
        const newestBackup = path.join(backupDir, backupFiles[0]);
        console.log(`📂 Використовую backup: ${backupFiles[0]}`);
        data = JSON.parse(fs.readFileSync(newestBackup, 'utf8'));
      }
    }
  }
  
  if (!data) {
    console.log('⚠️  Backup файли не знайдено, створюю тестові дані...');
    // await createTestData();
    return;
  }
  
  console.log('🧹 Очищення бази даних...');
  
  await prisma.reviews.deleteMany();
  console.log('   ✅ Відгуки очищено');
  
  // await prisma.orderedProducts.deleteMany();
  // console.log('   ✅ Замовлені товари очищено');
  
  // await prisma.basket.deleteMany();
  // console.log('   ✅ Кошики очищено');
  
  // await prisma.order.deleteMany();
  // console.log('   ✅ Замовлення очищено');
  
  await prisma.attributes.deleteMany();
  console.log('   ✅ Атрибути очищено');
  
  await prisma.products.deleteMany();
  console.log('   ✅ Продукти очищено');
  
  await prisma.user.deleteMany();
  console.log('   ✅ Користувачі очищено');
  

  console.log('\n🔄 Відновлення даних...');

  if (data.users?.length) {
    for (const user of data.users) {
      await prisma.user.create({ data: user });
    }
    console.log(`   ✅ Відновлено ${data.users.length} користувачів`);
  }

  if (data.products?.length) {
    for (const product of data.products) {
      await prisma.products.create({ data: product });
    }
    console.log(`   ✅ Відновлено ${data.products.length} продуктів`);
  }

  if (data.attributes?.length) {
    for (const attribute of data.attributes) {
      try {
        await prisma.attributes.create({ data: attribute });
      } catch (error) {
        console.warn(`   ⚠️ Помилка при створенні атрибуту для продукту ${attribute.productsId}:`, error);
      }
    }
    console.log(`   ✅ Відновлено ${data.attributes.length} атрибутів`);
  }
  
  if (data.orders?.length) {
    for (const order of data.orders) {
      try {
        // await prisma.order.create({ data: order });
      } catch (error) {
        console.warn(`   ⚠️ Помилка при створенні замовлення ${order.orderCode}:`, error);
      }
    }
    console.log(`   ✅ Відновлено ${data.orders.length} замовлень`);
  }
  
  if (data.reviews?.length) {
    for (const review of data.reviews) {
      try {
        await prisma.reviews.create({ data: review });
      } catch (error) {
        console.warn(`   ⚠️ Помилка при створенні відгуку ${review.id}:`, error);
      }
    }
    console.log(`   ✅ Відновлено ${data.reviews.length} відгуків`);
  }
  
  if (data.baskets?.length) {
    for (const basket of data.baskets) {
      // await prisma.basket.create({ data: basket });
    }
    console.log(`   ✅ Відновлено ${data.baskets.length} кошиків`);
  }
  
  if (data.orderedProducts?.length) {
    for (const ordered of data.orderedProducts) {
      try {
        // await prisma.orderedProducts.create({ data: ordered });
      } catch (error) {
        console.warn(`   ⚠️ Помилка при створенні замовленого товару ${ordered.id}:`, error);
      }
    }
    console.log(`   ✅ Відновлено ${data.orderedProducts.length} замовлених товарів`);
  }
  
  console.log('\n🎉 Seed завершено успішно!');
}

// async function createTestData() {
//   console.log('🔄 Створення тестових даних...');
  
//   const testUser = await prisma.user.create({
//     data: {
//       name: 'Test User',
//       email: 'test@example.com',
//       password: '$2b$10$hashedpassword',
//       role: 'user'
//     }
//   });

//   const testProduct = await prisma.products.create({
//     data: {
//       name: 'Test Hoodie',
//       brand: 'Test Brand',
//       price: 599.99,
//       discount: 0,
//       description: 'Test product description',
//       image: 'test-image.jpg'
//     }
//   });

//   await prisma.attributes.create({
//     data: {
//       productsId: testProduct.id,
//       type: 'hoodie',
//       category: 'male',
//       color: 'black',
//       size: 'M',
//       brand: 'Test Brand',
//       material: 'Cotton',
//       countryOfOrigin: 'Ukraine',
//       weight: 0.5
//     }
//   });

//   await prisma.order.create({
//     data: {
//       userName: testUser.name,
//       userEmail: testUser.email,
//       orderCode: 'TEST-001'
//     }
//   });

//   await prisma.reviews.create({
//     data: {
//       userId: testUser.id,
//       userName: testUser.name,
//       reviewTitle: 'Great product!',
//       rewiew: 'This is a test review.',
//       stars: 5
//     }
//   });
  
//   const testBasket = await prisma.basket.create({
//     data: {
//       firstName: 'Test',
//       lastName: 'User',
//       phone: 123456789,
//       email: 'test@example.com',
//       region: 'Test Region',
//       city: 'Test City',
//       issuePoint: 'Test Point',
//       deliveryMethod: 'Mail',
//       promoСode: 'TEST10'
//     }
//   });
  
//   await prisma.orderedProducts.create({
//     data: {
//       basketId: testBasket.id,
//       productName: testProduct.name,
//       quantity: 1,
//       price: testProduct.price,
//       totalPrice: testProduct.price
//     }
//   });
  
//   console.log('✅ Тестові дані створено успішно!');
// }

main()
  .catch((e) => {
    console.error('Помилка при виконанні seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
