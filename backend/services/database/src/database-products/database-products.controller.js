"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseProductsController = void 0;
const common_1 = require("@nestjs/common");
const database_products_service_1 = require("./database-products.service");
const microservices_1 = require("@nestjs/microservices");
let DatabaseProductsController = class DatabaseProductsController {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async getProducts() {
        const products = await this.databaseService.getAllProducts();
        return products;
    }
    async getProductById(data) {
        return this.databaseService.getProductById(data.id);
    }
    async getProductByName(data) {
        return this.databaseService.getProductByName(data.name);
    }
    async editProduct(data) {
        return this.databaseService.editProduct(data);
    }
    async editImage(file, imageURL) {
        return this.databaseService.editImage(file, imageURL);
    }
    async addProduct(data) {
        return this.databaseService.addProduct(data);
    }
    async deleteProductById(id) {
        return this.databaseService.deleteProsuctById(id);
    }
};
exports.DatabaseProductsController = DatabaseProductsController;
__decorate([
    (0, microservices_1.MessagePattern)('get_products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DatabaseProductsController.prototype, "getProducts", null);
__decorate([
    (0, microservices_1.MessagePattern)('get_product_by_id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DatabaseProductsController.prototype, "getProductById", null);
__decorate([
    (0, microservices_1.MessagePattern)('get_product_by_name'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DatabaseProductsController.prototype, "getProductByName", null);
__decorate([
    (0, microservices_1.MessagePattern)('edit_product'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DatabaseProductsController.prototype, "editProduct", null);
__decorate([
    (0, microservices_1.MessagePattern)('edit_image'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DatabaseProductsController.prototype, "editImage", null);
__decorate([
    (0, microservices_1.MessagePattern)('add_product'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DatabaseProductsController.prototype, "addProduct", null);
__decorate([
    (0, microservices_1.MessagePattern)('delete_product_by_id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DatabaseProductsController.prototype, "deleteProductById", null);
exports.DatabaseProductsController = DatabaseProductsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [database_products_service_1.DatabaseProductsService])
], DatabaseProductsController);
//# sourceMappingURL=database-products.controller.js.map