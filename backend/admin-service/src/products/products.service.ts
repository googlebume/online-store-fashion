import { Injectable } from '@nestjs/common';
import { databaseClient } from 'src/database.client';

@Injectable()
export class ProductsService {
    async getAll(){
        const products = await databaseClient.send('get_products', {})
        return products
    }
}
