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
            console.log('[ProductsService][getAll] Отримано відповідь:', products);
            if (!products || !products.data) {
                console.error('[ProductsService][getAll] Невалідна відповідь від БД:', products);
                return [];
            }
            return products.data;
        } catch (error) {
            console.error('[ProductsService][getAll] Помилка:', error);
            throw error;
        }
    }

    async editOneProduct(data, file?: Express.Multer.File) {
        console.log('[ProductsService][editOneProduct] Вхідні дані:', data);
        console.log('[ProductsService][editOneProduct] File received:', file ? { fieldname: file.fieldname, originalname: file.originalname, encoding: file.encoding, mimetype: file.mimetype, size: file.size } : 'NO FILE');
        try {
            const price = typeof data.price === 'string' ? Number(data.price) : data.price;
            const discount = typeof data.discount === 'string' ? Number(data.discount) : data.discount;
            const payload = {
                id: data.id,
                name: data.name,
                description: data.description,
                price,
                discount,
                brand: data.brand || '',
                image: data.image || '',
            };

            const response = await lastValueFrom(
                databaseClient.send('edit_product', payload)
            );
            console.log('[ProductsService][editOneProduct] Відповідь від БД:', response);

            if (file && response.success) {
                console.log('[ProductsService][editOneProduct] Processing image update...');
                const imageBuffer = Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer);
                console.log('[ProductsService][editOneProduct] Buffer size:', imageBuffer.length);
                const imageBase64 = imageBuffer.toString('base64');
                console.log('[ProductsService][editOneProduct] Base64 string length:', imageBase64.length);
                const imageResult = await lastValueFrom(databaseClient.send('edit_image', {
                    productId: data.id,
                    buffer: imageBase64,
                    mimetype: file.mimetype,
                    originalname: file.originalname,
                }));
                console.log('[ProductsService][editOneProduct] Image update result:', imageResult);
                if (!imageResult || !imageResult.success) {
                    console.error('[ProductsService][editOneProduct] Failed to update image', imageResult);
                    return { success: false, message: 'Failed to update image' };
                }
            } else if (!file) {
                console.log('[ProductsService][editOneProduct] No image file provided');
            }

            return response;
        } catch (error: string | any) {
            console.error('[ProductsService][editOneProduct] Помилка:', error);
            return { success: false, message: error.message };
        }
    }

    async addOneProduct(data, file?: Express.Multer.File) {
        console.log('[ProductsService][addOneProduct] Вхідні дані:', data);
        console.log('[ProductsService][addOneProduct] File received:', file ? { fieldname: file.fieldname, originalname: file.originalname, encoding: file.encoding, mimetype: file.mimetype, size: file.size } : 'NO FILE');
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
            const payload = {
                name: data.name,
                description: data.description,
                price,
                discount,
                brand: data.brand || '',
                image: '',
                attributes,
            };
            console.log('[ProductsService][addOneProduct] Payload для add_product:', payload);
            const createResult = await lastValueFrom(databaseClient.send('add_product', payload));
            console.log('[ProductsService][addOneProduct] Продукт створено:', createResult);
            if (!createResult || !createResult.success || !createResult.data) {
                return { success: false, message: 'Не вдалося створити продукт' };
            }
            let productId = createResult.data.id;
            let imageUrl = '';
            if (file) {
                console.log('[ProductsService][addOneProduct] Processing image upload...');
                const imageBuffer = Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer);
                console.log('[ProductsService][addOneProduct] Buffer size:', imageBuffer.length);
                const imageBase64 = imageBuffer.toString('base64');
                console.log('[ProductsService][addOneProduct] Base64 string length:', imageBase64.length);
                const imageResult = await lastValueFrom(databaseClient.send('save_product_image', {
                    buffer: imageBase64,
                    mimetype: file.mimetype,
                    originalname: file.originalname,
                    productId
                }));
                console.log('[ProductsService][addOneProduct] Image save result:', imageResult);
                if (imageResult && imageResult.success && imageResult.url) {
                    imageUrl = imageResult.url;
                    console.log('[ProductsService][addOneProduct] Image URL:', imageUrl);
                    await lastValueFrom(databaseClient.send('edit_product', { id: productId, image: imageUrl }));
                } else {
                    console.error('[ProductsService][addOneProduct] Не вдалося зберегти зображення', imageResult);
                    return { success: false, message: 'Не вдалося зберегти зображення' };
                }
            } else {
                console.log('[ProductsService][addOneProduct] No image file provided');
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
