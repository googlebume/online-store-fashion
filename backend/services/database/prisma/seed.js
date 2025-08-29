"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_1 = require("./generated/prisma-client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const prisma = new prisma_client_1.PrismaClient();
async function main() {
    console.log('🌱 Завантаження seed даних...');
    const backupDir = path.join(process.cwd(), 'prisma', 'backup');
    let data = null;
    if (fs.existsSync(backupDir)) {
        const latestBackupPath = path.join(backupDir, 'latest-backup.json');
        if (fs.existsSync(latestBackupPath)) {
            console.log('📂 Використовую latest-backup.json');
            data = await JSON.parse(fs.readFileSync(latestBackupPath, 'utf8'));
        }
        else {
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
        return;
    }
    console.log('🧹 Очищення бази даних...');
    await prisma.reviews.deleteMany();
    console.log('   ✅ Відгуки очищено');
    await prisma.orderedProducts.deleteMany();
    console.log('   ✅ Замовлені товари очищено');
    await prisma.basket.deleteMany();
    console.log('   ✅ Кошики очищено');
    await prisma.order.deleteMany();
    console.log('   ✅ Замовлення очищено');
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
            }
            catch (error) {
                console.warn(`   ⚠️ Помилка при створенні атрибуту для продукту ${attribute.productsId}:`, error);
            }
        }
        console.log(`   ✅ Відновлено ${data.attributes.length} атрибутів`);
    }
    if (data.orders?.length) {
        for (const order of data.orders) {
            try {
                await prisma.order.create({ data: order });
            }
            catch (error) {
                console.warn(`   ⚠️ Помилка при створенні замовлення ${order.orderCode}:`, error);
            }
        }
        console.log(`   ✅ Відновлено ${data.orders.length} замовлень`);
    }
    if (data.reviews?.length) {
        for (const review of data.reviews) {
            try {
                await prisma.reviews.create({ data: review });
            }
            catch (error) {
                console.warn(`   ⚠️ Помилка при створенні відгуку ${review.id}:`, error);
            }
        }
        console.log(`   ✅ Відновлено ${data.reviews.length} відгуків`);
    }
    if (data.baskets?.length) {
        for (const basket of data.baskets) {
            await prisma.basket.create({ data: basket });
        }
        console.log(`   ✅ Відновлено ${data.baskets.length} кошиків`);
    }
    if (data.orderedProducts?.length) {
        for (const ordered of data.orderedProducts) {
            try {
                await prisma.orderedProducts.create({ data: ordered });
            }
            catch (error) {
                console.warn(`   ⚠️ Помилка при створенні замовленого товару ${ordered.id}:`, error);
            }
        }
        console.log(`   ✅ Відновлено ${data.orderedProducts.length} замовлених товарів`);
    }
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
//# sourceMappingURL=seed.js.map