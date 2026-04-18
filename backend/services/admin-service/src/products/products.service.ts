import { HttpException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { databaseClient } from './../database.client';
import * as multer from 'multer';

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
            const response = await lastValueFrom(
                databaseClient.send('edit_product', file ? {...data, file: file} : data)
            );
            console.log('[ProductsService][editOneProduct] Відповідь від БД:', response);
            return response;
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
            const createResult = await lastValueFrom(databaseClient.send('add_product', payload));
            console.log('[ProductsService][addOneProduct] Продукт створено:', createResult);
            if (!createResult || !createResult.success || !createResult.data) {
                return { success: false, message: 'Не вдалося створити продукт' };
            }
            let productId = createResult.data.id;
            let imageUrl = '';
            if (file) {
                const imageResult = await lastValueFrom(databaseClient.send('save_product_image', { file, productId }));
                if (imageResult && imageResult.success && imageResult.url) {
                    imageUrl = imageResult.url;
                    await lastValueFrom(databaseClient.send('edit_product', { id: productId, image: imageUrl }));
                } else {
                    console.error('[ProductsService][addOneProduct] Не вдалося зберегти зображення', imageResult);
                    return { success: false, message: 'Не вдалося зберегти зображення' };
                }
            }
            return { success: true, message: 'Product added successfully', data: { ...createResult.data, image: imageUrl } };
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
