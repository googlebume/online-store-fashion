import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { databaseClient } from '../database.client';

@Injectable()
export class ProductCardsLinksService {
    async getProductByName(name: string) {
        try {
            const product = await lastValueFrom(databaseClient.send('get_product_by_name', { name }));
            
            return product;
        } catch (error) {
            console.error('Microservice error:', error);
            throw new Error(`Failed to get product from database: ${error.message}`);
        }
    }

    async getRandomProducts(count: number): Promise<any[]> {
        try {
            const allProducts = await lastValueFrom(databaseClient.send('get_products', {}));
            
            if (!allProducts || allProducts.length === 0) {
                console.warn('No products found in database');
                return [];
            }
            const shuffled = this.shuffleArray([...allProducts]);
            const selectedProducts = shuffled.slice(0, Math.min(count, shuffled.length));
            
            return selectedProducts;
        } catch (error) {
            console.error('Error fetching random products:', error);
            return [];
        }
    }
    async getRandomProductsByIds(count: number): Promise<any[]> {
        const knownUUIDs = [
            '90123456-7890-1234-2345-901234000890',
        ];

        const randomUUIDs = this.getRandomElements(knownUUIDs, count);
        const products: any[] = [];

        for (const id of randomUUIDs) {
            try {
                const product = await lastValueFrom(databaseClient.send('get_product_by_id', { id }));
                if (product) {
                    products.push(product);
                }
            } catch (error) {
                console.error(`Error fetching product with ID ${id}:`, error);
            }
        }

        return products;
    }
    async getProductIds(): Promise<string[]> {
        try {
            const products = await lastValueFrom(databaseClient.send('get_all_products', {}));
            return products.map((product: any) => product.id);
        } catch (error) {
            console.error('Error fetching product IDs:', error);
            return [];
        }
    }

    async getRandomProductsOptimized(count: number): Promise<any[]> {
        try {
            const productIds = await this.getProductIds();
            
            if (productIds.length === 0) {
                return [];
            }

            const randomIds = this.getRandomElements(productIds, count);
            const products: any[] = [];

            for (const id of randomIds) {
                try {
                    const product = await lastValueFrom(databaseClient.send('get_product_by_id', { id }));
                    if (product) {
                        products.push(product);
                    }
                } catch (error) {
                    console.error(`Error fetching product with ID ${id}:`, error);
                }
            }

            return products;
        } catch (error) {
            console.error('Error in getRandomProductsOptimized:', error);
            return [];
        }
    }

    private shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    private getRandomElements<T>(array: T[], count: number): T[] {
        if (array.length <= count) {
            return [...array];
        }
        
        const shuffled = this.shuffleArray(array);
        return shuffled.slice(0, count);
    }

    private getRandomIds(count: number, min: number, max: number): number[] {
        const ids = new Set<number>();
        
        while (ids.size < count) {
            const id = Math.floor(Math.random() * (max - min + 1)) + min;
            ids.add(id);
        }

        return Array.from(ids);
    }
}