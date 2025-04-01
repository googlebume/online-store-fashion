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
}
