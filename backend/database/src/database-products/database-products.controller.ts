import { Controller } from '@nestjs/common';
import { DatabaseProductsService } from './database-products.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class DatabaseProductsController {
  constructor(private readonly databaseService: DatabaseProductsService) { }

  @MessagePattern('get_products')
  async getProducts() {
    const products = await this.databaseService.getAllProducts();
    return products;
  }

  @MessagePattern('get_product_by_id')
  async getProductById(data: { id: number }) {
    return this.databaseService.getProductById(data.id);
  }

  @MessagePattern('get_product_by_name')
  async getProductByName(data: { name: string }) {
    return this.databaseService.getProductByName(data.name);
  }

  @MessagePattern('edit_product')
  async editProduct(data: any) {
    return this.databaseService.editProduct(data);
  }

  @MessagePattern('edit_image')
  async editImage(file: Express.Multer.File, imageURL: string ) {
    return this.databaseService.editImage(file, imageURL);
  }
}