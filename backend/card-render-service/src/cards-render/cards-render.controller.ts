import { CardsRenderService } from './cards-render.service';
import { Controller, Post, Body, Get } from '@nestjs/common';

@Controller('shop')
export class CardsRenderController {
  constructor(private readonly appService: CardsRenderService) {}
  @Get('')
  getProducts() {
    return this.appService.getProducts();
  }
}
