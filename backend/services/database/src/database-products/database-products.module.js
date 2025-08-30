"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseProductsModule = void 0;
const common_1 = require("@nestjs/common");
const database_products_service_1 = require("./database-products.service");
const database_products_controller_1 = require("./database-products.controller");
const prisma_service_1 = require("../prisma.service");
const product_repository_1 = require("../repositories/product.repository");
let DatabaseProductsModule = class DatabaseProductsModule {
};
exports.DatabaseProductsModule = DatabaseProductsModule;
exports.DatabaseProductsModule = DatabaseProductsModule = __decorate([
    (0, common_1.Module)({
        controllers: [database_products_controller_1.DatabaseProductsController],
        providers: [database_products_service_1.DatabaseProductsService, product_repository_1.ProductRepository, prisma_service_1.PrismaService],
    })
], DatabaseProductsModule);
//# sourceMappingURL=database-products.module.js.map