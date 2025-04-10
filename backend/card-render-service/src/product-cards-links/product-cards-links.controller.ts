import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ProductCardsLinksService } from './product-cards-links.service';

@Controller(`shop/product`)
export class ProductCardsLinksController {
    constructor(private readonly productCardsLinksService: ProductCardsLinksService) { }

    @Post()
    receiveProductName(@Body() requestBody: { productName: string }) {  // Змінено name на productName
        const { productName } = requestBody;
        return { success: true, productName };
    }

    @Get(':name')
    async returnProductByPathParam(@Param('name') name: string) {
        try {
            const product = await this.productCardsLinksService.getProductByName(name);
            return product;
        } catch (error) {
            // Обробка помилки
            console.error('Error fetching product:', error);
            return { error: 'Could not fetch product', message: error.message };
        }
    }
}
