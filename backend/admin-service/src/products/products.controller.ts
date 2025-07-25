import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('fashion/admin/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get('')
  getAllProducts() {
    return this.productsService.getAll()
  }

  @Post('edit')
  editProduct(@Body() data: any) {
    return this.productsService.editOneProduct(data);
  }
}
