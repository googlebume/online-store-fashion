import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Products } from '@prisma/client';

@Controller('fashion/admin/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get('')
  getAllProducts() {
    return this.productsService.getAll()
  }

  @UseInterceptors(FileInterceptor('image'))
  @Post('edit')
  editProduct(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: Products
  ) {
    // console.log('body:', body);
    return this.productsService.editOneProduct({ ...body, 'file': image });
  }

  @UseInterceptors(FileInterceptor('image'))
  @Post('add')
  addProduct(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: Products
  ) {
    // console.log('Adding product with image:', body, image);
    return this.productsService.addOneProduct(body, image);
  }

  @Delete('delete/:id')
  deleteProduct(
    @Param('id') id: string,
  ) {
    return this.productsService.deleteProductById(id);
  }
}
