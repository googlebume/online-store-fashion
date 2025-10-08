import { PrismaClient } from './generated/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function exportToJson() {
  try {
    console.log('🔄 Експорт даних з бази...');
    
    const data = {
      users: await prisma.user.findMany(),
      products: await prisma.products.findMany(),
      attributes: await prisma.attributes.findMany(),
      // baskets: await prisma.basket.findMany(),
      // orderedProducts: await prisma.orderedProducts.findMany(),
      // orders: await prisma.order.findMany(),
      reviews: await prisma.reviews.findMany(),
    };

    const backupDir = path.join(process.cwd(), 'backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const fileName = `database-backup-${timestamp}.json`;
    const filePath = path.join(backupDir, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    console.log(`Дані експортовано в: ${filePath}`);
    console.log('\nСтатистика:');
    console.log(`   Користувачі: ${data.users.length}`);
    console.log(`   Продукти: ${data.products.length}`);
    console.log(`   Атрибути: ${data.attributes.length}`);
    // console.log(`   Кошики: ${data.baskets.length}`);
    // console.log(`   Замовлені товари: ${data.orderedProducts.length}`);
    // console.log(`   Замовлення: ${data.orders.length}`);
    console.log(`   Відгуки: ${data.reviews.length}`);
    
    const latestPath = path.join(backupDir, 'latest-backup.json');
    fs.writeFileSync(latestPath, JSON.stringify(data, null, 2));
    console.log(`✅ Копія збережена як: ${latestPath}`);
    
  } catch (error) {
    console.error('Помилка при експорті:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportToJson();