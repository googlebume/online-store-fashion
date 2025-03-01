import { AppService } from './app.service';
import { Controller, Post, Body, Get } from '@nestjs/common';

@Controller('shop')
export class CardsController {
  constructor(private readonly appService: AppService) {}
  @Get('')
  getProducts() {
    return this.appService.getProducts();
  }
}

