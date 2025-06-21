import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { productsDB } from '../dto/productsDB'
import { databaseClient } from '../database.client';

@Injectable()
export class CardsRenderService {

    async getProducts(): Promise<object[]> {
        const response = await lastValueFrom(databaseClient.send('get_products', {}));
        // console.log('Отримано відповідь:', response);

        if (!Array.isArray(response)) {
            console.error('Помилка: response не є масивом', response);
            return [];
        }

        // const updatedProducts = response.map((product) => {
        //     // const foundProduct = productsDB.find(p => p.id === product.id);
        //     return {
        //         ...product,
        //         // image: foundProduct ? foundProduct.image : "https://surl.li/msfwst"
        //     };
        // });

        // console.log('Оновлені продукти:', updatedProducts);
        return response;
    }
}