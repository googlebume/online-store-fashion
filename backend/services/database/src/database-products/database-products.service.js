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
exports.DatabaseProductsService = void 0;
const common_1 = require("@nestjs/common");
const product_repository_1 = require("../repositories/product.repository");
let DatabaseProductsService = class DatabaseProductsService {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async getAllProducts() {
        const products = await this.productRepository.findAll();
        return products;
    }
    async getProductById(id) {
        return this.productRepository.findById(id);
    }
    async getProductByName(name) {
        return this.productRepository.findByName(name);
    }
    editProduct(data) {
        return this.productRepository.editProduct(data);
    }
    editImage(file, imageURL) {
        return this.productRepository.editImage(file, imageURL);
    }
    addProduct(data) {
        return this.productRepository.addProduct(data);
    }
    deleteProsuctById(id) {
        return this.productRepository.deleteProductById(id);
    }
};
exports.DatabaseProductsService = DatabaseProductsService;
exports.DatabaseProductsService = DatabaseProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_repository_1.ProductRepository])
], DatabaseProductsService);
//# sourceMappingURL=database-products.service.js.map