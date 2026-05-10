import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../common/decorators/roles-metadata.decorator';
import { JwtAuthGuard } from '@packages/shared/common/guards/jwt-auth.guard';
import { RolesGuard } from '@packages/shared/common/guards/roles.guard';
import { ValidateWebpOnlyPipe } from '@packages/shared/common/pipes/validate-webp-only.pipe';
import {
  productArraySchema,
  productSchema,
  successMessageSchema,
} from '@packages/shared/common/swagger/response-schemas';


@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Admin Products')
@ApiBearerAuth('bearer')
@Controller('fashion/admin/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get('')
  @ApiOperation({ summary: 'Get all products for admin panel' })
  @ApiOkResponse({ description: 'All products', schema: productArraySchema })
  getAllProducts() {
    return this.productsService.getAll()
  }

  @UseInterceptors(FileInterceptor('image'))
  @Post('edit')
  @ApiOperation({ summary: 'Update product and optionally replace its image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '9f5051b7-5f5d-4f6e-9f35-2f3d9aa4f001' },
        name: { type: 'string', example: 'Classic Hoodie' },
        description: { type: 'string', example: 'Updated hoodie description' },
        price: { type: 'number', example: 1999 },
        brand: { type: 'string', example: 'Fashion Brand' },
        discount: { type: 'number', example: 10 },
        attributes: { type: 'string', example: '{\"type\":\"hoodie\",\"color\":\"black\"}' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOkResponse({ description: 'Updated product result', schema: { type: 'object', properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', example: 'Product updated successfully' },
    data: productSchema,
  } } })
  editProduct(
    @UploadedFile(ValidateWebpOnlyPipe) image: Express.Multer.File,
    @Body() body: any
  ) {
    // console.log('body:', body);
    return this.productsService.editOneProduct(body, image);
  }

  @UseInterceptors(FileInterceptor('image'))
  @Post('add')
  @ApiOperation({ summary: 'Create a new product with image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'description', 'price', 'brand'],
      properties: {
        name: { type: 'string', example: 'Classic Hoodie' },
        description: { type: 'string', example: 'Warm cotton hoodie' },
        price: { type: 'number', example: 1999 },
        brand: { type: 'string', example: 'Fashion Brand' },
        discount: { type: 'number', example: 10 },
        attributes: { type: 'string', example: '{\"type\":\"hoodie\",\"color\":\"black\"}' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Created product result', schema: { type: 'object', properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', example: 'Product added successfully' },
    data: productSchema,
  } } })
  addProduct(
    @UploadedFile(ValidateWebpOnlyPipe) image: Express.Multer.File,
    @Body() body: any
  ) {
    // console.log('Adding product with image:', body, image);
    return this.productsService.addOneProduct(body, image);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete product by id' })
  @ApiParam({ name: 'id', example: '9f5051b7-5f5d-4f6e-9f35-2f3d9aa4f001' })
  @ApiOkResponse({ description: 'Deletion result', schema: successMessageSchema })
  deleteProduct(
    @Param('id') id: string,
  ) {
    return this.productsService.deleteProductById(id);
  }
}
