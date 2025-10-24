import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { productsDB } from '../dto/productsDB'
import { databaseClient } from '../database.client';

@Injectable()
export class CardsRenderService {

    async getProducts(): Promise<object[]> {
        const response = await lastValueFrom(databaseClient.send('get_products', {}));

        if (!Array.isArray(response)) {
            console.error('Помилка: response не є масивом', response);
            return [];
        }

        return response;
    }

    async dynamicallyLoad(params: {take: number, page: number, cursor?: string}) {
        const response = await lastValueFrom(databaseClient.send('get_products_dynamically', params))
        return response
    }
}