import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('fashion/admin')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  getAllProducts(){
    return this.productsService.getAll()
  }
}
