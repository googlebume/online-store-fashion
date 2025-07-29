import { HttpException, Injectable } from '@nestjs/common';
import { databaseClient } from 'src/database.client';

@Injectable()
export class ProductsService {
    async getAll() {
        const products = await databaseClient.send('get_products', {})
        return products
    }

    async editOneProduct(data) {
    console.log('DATA:    ', data);
    
    try {
        const productInDB = await databaseClient.send('get_product_by_id', { id: +data.id }).toPromise();

        if (JSON.stringify(productInDB) === JSON.stringify(data)) {
            throw new HttpException(`Product with id ${data.id} already exists with same data`, 400);
        }

        const response = await databaseClient.send('edit_product', data).toPromise();
        console.log('response   ', response);
        
        return { success: true, data: response };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, message: error.message };
    }
}
}
