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
const client_1 = require("./generated/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const prisma = new client_1.PrismaClient();
async function exportToJson() {
    try {
        console.log('🔄 Експорт даних з бази...');
        const data = {
            users: await prisma.user.findMany(),
            products: await prisma.products.findMany(),
            attributes: await prisma.attributes.findMany(),
            baskets: await prisma.basket.findMany(),
            orderedProducts: await prisma.orderedProducts.findMany(),
            orders: await prisma.order.findMany(),
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
        console.log(`   Кошики: ${data.baskets.length}`);
        console.log(`   Замовлені товари: ${data.orderedProducts.length}`);
        console.log(`   Замовлення: ${data.orders.length}`);
        console.log(`   Відгуки: ${data.reviews.length}`);
        const latestPath = path.join(backupDir, 'latest-backup.json');
        fs.writeFileSync(latestPath, JSON.stringify(data, null, 2));
        console.log(`✅ Копія збережена як: ${latestPath}`);
    }
    catch (error) {
        console.error('Помилка при експорті:', error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
exportToJson();
//# sourceMappingURL=exportjson.js.map