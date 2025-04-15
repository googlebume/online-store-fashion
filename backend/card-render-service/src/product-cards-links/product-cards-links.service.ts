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

      
      // Асинхронна функція для отримання продуктів по згенерованих ID
      async getRandomProducts(count: number): Promise<any[]> {
        const randomIds = this.getRandomIds(count, 1, 20);
        const products: any[] = [];
      
        for (const id of randomIds) {
          try {
            const product = await lastValueFrom(databaseClient.send('get_product_by_id', { id }));
            products.push(product);
          } catch (error) {
            console.error(`Error fetching product with ID ${id}:`, error);
          }
        }
      
        return products;
      }


      getRandomIds(count: number, min: number, max: number): number[] {
        const ids = new Set<number>();
        
        while (ids.size < count) {
            const id = Math.floor(Math.random() * (max - min + 1)) + min;
            ids.add(id);
        }
    
        return Array.from(ids);
    }
    
}
