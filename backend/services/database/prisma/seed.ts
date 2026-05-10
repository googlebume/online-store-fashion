import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcryptjs';
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
      data = JSON.parse(fs.readFileSync(latestBackupPath, 'utf8'));
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
    await createTestData();
    return;
  }
  
  console.log('🧹 Очищення бази даних...');

  await prisma.analyticsEvent.deleteMany();
  console.log('   ✅ Події аналітики очищено');

  await prisma.reviews.deleteMany();
  console.log('   ✅ Відгуки очищено');

  await prisma.producsAnalytics.deleteMany();
  console.log('   ✅ Аналітика продуктів очищено');
  
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

async function wipeForFreshSeed(): Promise<void> {
  await prisma.analyticsEvent.deleteMany();
  await prisma.reviews.deleteMany();
  await prisma.producsAnalytics.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.promoCodeProductType.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.attributes.deleteMany();
  await prisma.products.deleteMany();
  await prisma.user.deleteMany();
}

/** Демо-каталог, коли немає prisma/backup/*.json (назви збігаються з файлами в /products на database HTTP). */
async function createTestData(): Promise<void> {
  console.log('🔄 Створення демо-користувачів і товарів...');
  await wipeForFreshSeed();

  const passwordHash = bcrypt.hashSync('ShopDemo2026!', 10);

  await prisma.user.create({
    data: {
      name: 'Demo Admin',
      email: 'admin@demo.local',
      password: passwordHash,
      role: 'admin',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Demo Shopper',
      email: 'shopper@demo.local',
      password: passwordHash,
      role: 'user',
    },
  });

  const rows: Array<{
    name: string;
    brand: string;
    price: number;
    discount: number;
    description: string;
    image: string;
    type: 'hoodie' | 'sweatshirt' | 'shirt' | 'tshirt';
    category: 'male' | 'female';
    color:
      | 'black'
      | 'white'
      | 'yellow'
      | 'pink'
      | 'brown'
      | 'blue';
    size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  }> = [
    {
      name: 'Oversize Hoodie',
      brand: 'UrbanFit',
      price: 1200,
      discount: 15,
      description: 'Oversize худі, універсальний крій.',
      image: 'http://localhost:5000/products/hoodie_1_1.webp',
      type: 'hoodie',
      category: 'male',
      color: 'black',
      size: 'L',
    },
    {
      name: 'Casual Hoodie',
      brand: 'UrbanFit',
      price: 1100,
      discount: 10,
      description: 'Casual худі на кожен день.',
      image: 'http://localhost:5000/products/hoodie_2_1.webp',
      type: 'hoodie',
      category: 'male',
      color: 'white',
      size: 'M',
    },
    {
      name: 'Sporty Hoodie',
      brand: 'FlexLine',
      price: 1300,
      discount: 20,
      description: 'Спортивне худі з м\'якою внутрішньою стороною.',
      image: 'http://localhost:5000/products/hoodie_3_1.webp',
      type: 'hoodie',
      category: 'female',
      color: 'white',
      size: 'S',
    },
    {
      name: 'Classic Sweatshirt',
      brand: 'MonoTone',
      price: 1000,
      discount: 12,
      description: 'Класичний світшот.',
      image: 'http://localhost:5000/products/sweatshirt_1_1.webp',
      type: 'sweatshirt',
      category: 'male',
      color: 'black',
      size: 'XL',
    },
    {
      name: 'Formal Shirt',
      brand: 'OfficeLine',
      price: 1500,
      discount: 18,
      description: 'Сорочка для офісу та подій.',
      image: 'http://localhost:5000/products/shirt_1_1.webp',
      type: 'shirt',
      category: 'male',
      color: 'white',
      size: 'L',
    },
    {
      name: 'Basic T-shirt',
      brand: 'CoreWear',
      price: 800,
      discount: 5,
      description: 'Базова футболка.',
      image: 'http://localhost:5000/products/tshirt_1_1.webp',
      type: 'tshirt',
      category: 'female',
      color: 'pink',
      size: 'M',
    },
    {
      name: 'Graphic T-shirt',
      brand: 'StreetLab',
      price: 850,
      discount: 10,
      description: 'Футболка з принтом.',
      image: 'http://localhost:5000/products/tshirt_2_1.webp',
      type: 'tshirt',
      category: 'male',
      color: 'yellow',
      size: 'L',
    },
    {
      name: 'Linen Shirt',
      brand: 'Breeze',
      price: 1450,
      discount: 10,
      description: 'Лляна сорочка.',
      image: 'http://localhost:5000/products/shirt_3_1.webp',
      type: 'shirt',
      category: 'male',
      color: 'blue',
      size: 'M',
    },
  ];

  for (const row of rows) {
    const { type, category, color, size, ...productData } = row;
    const product = await prisma.products.create({ data: productData });
    await prisma.attributes.create({
      data: {
        productsId: product.id,
        type,
        category,
        color,
        size,
        brand: productData.brand,
        material: 'Cotton',
        countryOfOrigin: 'Ukraine',
        weight: 0.45,
      },
    });
  }

  console.log(`✅ Додано ${rows.length} товарів; логін демо: admin@demo.local / ShopDemo2026!`);
  console.log('\n🎉 Seed завершено успішно!');
}

main()
  .catch((e) => {
    console.error('Помилка при виконанні seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
