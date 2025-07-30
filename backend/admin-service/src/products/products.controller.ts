import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';

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
    @Body() body: any
  ) {
    // console.log('image:', image);
    // console.log('body:', body);
    // console.log('other form data:', body);
    return this.productsService.editOneProduct({ ...body, 'file': image });
    // return this.productsService.editOneProduct({ ...body});
  }
}
