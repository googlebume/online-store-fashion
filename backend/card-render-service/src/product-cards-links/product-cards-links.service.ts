import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { databaseClient } from '../database.client';

@Injectable()
export class ProductCardsLinksService {
    async getProductByName(name: string) {
        try {
            const product = await lastValueFrom(databaseClient.send('get_product_by_name',  {name} ));
            return product;
        } catch (error) {
            console.error('Microservice error:', error);
            throw new Error(`Failed to get product from database: ${error.message}`);
        }
    }
}
