import { get } from 'http';
import { CardsRenderService } from './cards-render.service';
import { Controller, Post, Body, Get } from '@nestjs/common';

@Controller()
export class CardsRenderController {
    constructor(private readonly appService: CardsRenderService) { }
    @Get('shop')
    getProducts() {
        return this.appService.getProducts();
    }
    @Get('db')
    async useDBBB() {
        const result = await this.appService.useDB();
        console.log('Отримані продукти:', result);
        return result;
    }
}
