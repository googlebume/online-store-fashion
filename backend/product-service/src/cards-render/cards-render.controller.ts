import { CardsRenderService } from './cards-render.service';
import { Controller, Post, Body, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Controller('fashion')
export class CardsRenderController {
    constructor(private readonly appService: CardsRenderService) { }
    @Throttle({ default: { ttl: 60000, limit: 100 } })
    @Get(`shop`)
    getProducts() {
        return this.appService.getProducts();
    }
    
}
