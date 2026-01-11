import { HttpException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { databaseClient } from './../database.client';
import File from 'multer';

@Injectable()
export class ProductsService {
    async getAll() {
        console.log('[ProductsService][getAll] Виклик методу getAll');
        try {
            const products = await lastValueFrom(databaseClient.send('get_products', {}));
            return products.data;
        } catch (error) {
            console.error('[ProductsService][getAll] Помилка:', error);
            throw error;
        }
    }

    async editOneProduct(data, file?: Express.Multer.File) {
        console.log('[ProductsService][editOneProduct] Вхідні дані:', data, 'file:', !!file);
        try {
            const productInDB = await databaseClient.send('get_product_by_id', { id: data.id }).toPromise();
            console.log('[ProductsService][editOneProduct] Продукт у БД:', productInDB);
            if (JSON.stringify(productInDB) === JSON.stringify(data)) {
                console.warn(`[ProductsService][editOneProduct] Продукт з id ${data.id} вже існує з такими ж даними`);
                throw new HttpException(`Product with id ${data.id} already exists with same data`, 400);
            }
            const response = await databaseClient.send('edit_product', file ? {...data, file: file} : data).toPromise();
            console.log('[ProductsService][editOneProduct] Відповідь від БД:', response);
            return { success: true, data: response };
        } catch (error: string | any) {
            console.error('[ProductsService][editOneProduct] Помилка:', error);
            return { success: false, message: error.message };
        }
    }

    async addOneProduct(data, file?: Express.Multer.File) {
        console.log('[ProductsService][addOneProduct] Вхідні дані:', data, 'file:', !!file);
        try {
            let attributes = data.attributes;
            if (typeof attributes === 'string') {
                try {
                    attributes = JSON.parse(attributes);
                } catch (e) {
                    return { success: false, message: 'Некоректний формат attributes' };
                }
            }
            const price = typeof data.price === 'string' ? Number(data.price) : data.price;
            const discount = typeof data.discount === 'string' ? Number(data.discount) : data.discount;
            const { event, ...rest } = data;
            const payload = { ...rest, price, discount, attributes, image: '' };
            console.log('[ProductsService][addOneProduct] Payload для add_product:', payload);
            const createResult = await databaseClient.send('add_product', payload).toPromise();
            console.log('[ProductsService][addOneProduct] Продукт створено:', createResult);
            if (!createResult || !createResult.success || !createResult.product || !createResult.product.id) {
                return { success: false, message: 'Не вдалося створити продукт' };
            }
            let productId = createResult.product.id;
            let imageUrl = '';
            if (file) {
                const imageResult = await databaseClient.send('save_product_image', { file, productId }).toPromise();
                if (imageResult && imageResult.success && imageResult.imageUrl) {
                    imageUrl = imageResult.imageUrl;
                    await databaseClient.send('edit_product', { id: productId, image: imageUrl }).toPromise();
                } else {
                    console.error('[ProductsService][addOneProduct] Не вдалося зберегти зображення', imageResult);
                    return { success: false, message: 'Не вдалося зберегти зображення' };
                }
            }
            return { success: true, message: 'Product added successfully', product: { ...createResult.product, image: imageUrl } };
        } catch (error: string | any) {
            console.error('[ProductsService][addOneProduct] Помилка:', error);
            return { success: false, message: error.message };
        }
    }

    async deleteProductById(id: string) {
        console.log('[ProductsService][deleteProductById] Видалення продукту з id:', id);
        try {
            const deleteProduct = await lastValueFrom(
                databaseClient.send('delete_product_by_id', { id })
            );
            console.log('[ProductsService][deleteProductById] Відповідь від БД:', deleteProduct);
            return deleteProduct;
        } catch (error) {
            console.error('[ProductsService][deleteProductById] Помилка:', error);
            throw error;
        }
    }
}
