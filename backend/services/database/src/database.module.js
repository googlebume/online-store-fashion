"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const product_repository_1 = require("./repositories/product.repository");
const prisma_service_1 = require("./prisma.service");
const database_products_module_1 = require("./database-products/database-products.module");
const database_users_module_1 = require("./database-users/database-users.module");
const user_repository_1 = require("./repositories/user.repository");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [database_products_module_1.DatabaseProductsModule, database_users_module_1.DatabaseUsersModule],
        controllers: [prisma_service_1.PrismaService,],
        providers: [prisma_service_1.PrismaService, product_repository_1.ProductRepository, user_repository_1.UserRepository],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map