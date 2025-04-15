import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ProductCardsLinksService } from './product-cards-links.service';

@Controller(`fashion/shop/product`)
export class ProductCardsLinksController {
    constructor(private readonly productCardsLinksService: ProductCardsLinksService) { }

    // @Post()
    // receiveProductName(@Body() requestBody: { productName: string }) {
    //     const { productName } = requestBody;
    //     return { success: true, productName };
    // }
    @Get()
    async returnMightlikeProducts(){
        try{
            const mightlikeProducts = await this.productCardsLinksService.getRandomProducts(9)
            return mightlikeProducts;
        } catch(error) {
            console.error('Error fetching rendom products:', error);
            return { error: 'Could not fetch product', message: error.message };
        }
    }

    @Get(':name')
    async returnProductByPathParam(@Param('name') name: string) {
        try {
            const product = await this.productCardsLinksService.getProductByName(name);
            return product;
        } catch (error) {
            console.error('Error fetching product:', error);
            return { error: 'Could not fetch product', message: error.message };
        }
    }
}
