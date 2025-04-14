import { get } from 'http';
import { CardsRenderService } from './cards-render.service';
import { Controller, Post, Body, Get } from '@nestjs/common';

@Controller()
export class CardsRenderController {
    constructor(private readonly appService: CardsRenderService) { }
    @Get(`fashion/shop`)
    getProducts() {
        return this.appService.getProducts();
    }
}
