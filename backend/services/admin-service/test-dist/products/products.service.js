"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const database_client_1 = require("./../database.client");
let ProductsService = class ProductsService {
    async getAll() {
        console.log('[ProductsService][getAll] Виклик методу getAll');
        try {
            const products = await (0, rxjs_1.lastValueFrom)(database_client_1.databaseClient.send('get_products', {}));
            return products.data;
        }
        catch (error) {
            console.error('[ProductsService][getAll] Помилка:', error);
            throw error;
        }
    }
    async editOneProduct(data, file) {
        console.log('[ProductsService][editOneProduct] Вхідні дані:', data, 'file:', !!file);
        try {
            const productInDB = await database_client_1.databaseClient.send('get_product_by_id', { id: data.id }).toPromise();
            console.log('[ProductsService][editOneProduct] Продукт у БД:', productInDB);
            if (JSON.stringify(productInDB) === JSON.stringify(data)) {
                console.warn(`[ProductsService][editOneProduct] Продукт з id ${data.id} вже існує з такими ж даними`);
                throw new common_1.HttpException(`Product with id ${data.id} already exists with same data`, 400);
            }
            const response = await database_client_1.databaseClient.send('edit_product', file ? { ...data, file: file } : data).toPromise();
            console.log('[ProductsService][editOneProduct] Відповідь від БД:', response);
            return { success: true, data: response };
        }
        catch (error) {
            console.error('[ProductsService][editOneProduct] Помилка:', error);
            return { success: false, message: error.message };
        }
    }
    async addOneProduct(data, file) {
        console.log('[ProductsService][addOneProduct] Вхідні дані:', data, 'file:', !!file);
        try {
            let attributes = data.attributes;
            if (typeof attributes === 'string') {
                try {
                    attributes = JSON.parse(attributes);
                }
                catch (e) {
                    return { success: false, message: 'Некоректний формат attributes' };
                }
            }
            const price = typeof data.price === 'string' ? Number(data.price) : data.price;
            const discount = typeof data.discount === 'string' ? Number(data.discount) : data.discount;
            const { event, ...rest } = data;
            const payload = { ...rest, price, discount, attributes, image: '' };
            console.log('[ProductsService][addOneProduct] Payload для add_product:', payload);
            const createResult = await database_client_1.databaseClient.send('add_product', payload).toPromise();
            console.log('[ProductsService][addOneProduct] Продукт створено:', createResult);
            if (!createResult || !createResult.success || !createResult.product || !createResult.product.id) {
                return { success: false, message: 'Не вдалося створити продукт' };
            }
            let productId = createResult.product.id;
            let imageUrl = '';
            if (file) {
                const imageResult = await database_client_1.databaseClient.send('save_product_image', { file, productId }).toPromise();
                if (imageResult && imageResult.success && imageResult.imageUrl) {
                    imageUrl = imageResult.imageUrl;
                    await database_client_1.databaseClient.send('edit_product', { id: productId, image: imageUrl }).toPromise();
                }
                else {
                    console.error('[ProductsService][addOneProduct] Не вдалося зберегти зображення', imageResult);
                    return { success: false, message: 'Не вдалося зберегти зображення' };
                }
            }
            return { success: true, message: 'Product added successfully', product: { ...createResult.product, image: imageUrl } };
        }
        catch (error) {
            console.error('[ProductsService][addOneProduct] Помилка:', error);
            return { success: false, message: error.message };
        }
    }
    async deleteProductById(id) {
        console.log('[ProductsService][deleteProductById] Видалення продукту з id:', id);
        try {
            const deleteProduct = await (0, rxjs_1.lastValueFrom)(database_client_1.databaseClient.send('delete_product_by_id', { id }));
            console.log('[ProductsService][deleteProductById] Відповідь від БД:', deleteProduct);
            return deleteProduct;
        }
        catch (error) {
            console.error('[ProductsService][deleteProductById] Помилка:', error);
            throw error;
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)()
], ProductsService);
//# sourceMappingURL=products.service.js.map