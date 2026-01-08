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

    @Post(`shop-dynamically`)
    async dynamicallyLoad(@Body() params:{take: number, page: number, cursor?: string}){
        const loaded = await this.appService.dynamicallyLoad(params)
        // console.log(loaded)
        return loaded
    }
    
}
