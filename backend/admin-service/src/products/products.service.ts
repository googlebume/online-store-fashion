import { HttpException, Injectable } from '@nestjs/common';
import { databaseClient } from 'src/database.client';

@Injectable()
export class ProductsService {
    async getAll() {
        const products = await databaseClient.send('get_products', {})
        return products
    }

    editOneProduct(data) {
        console.log('DATA:    ', data)
        const productInDB = databaseClient.send('get_product_by_id', { id: data.id });
        if (productInDB == data) {
            throw new HttpException(`Product with id ${data.id} already exists`, 400);
        }
        try {
            databaseClient.send('edit_product', data);
            return {success: true};
        } catch (error) {
            return {success: false, message: error.message};
        }
        
    }
}
