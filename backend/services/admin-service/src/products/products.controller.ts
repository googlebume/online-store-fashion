import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Products } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles-metadata.decorator';

//ТИМЧАСОВО
import { JwtAuthGuard } from 'D:/projects/online-store-fashion/backend/packages/shared/dist/common/guards/jwt-auth.guard';
import { RolesGuard } from 'D:/projects/online-store-fashion/backend/packages/shared/dist/common/guards/roles.guard';


@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
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
