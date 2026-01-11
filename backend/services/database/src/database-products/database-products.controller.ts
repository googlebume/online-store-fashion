import { Controller } from '@nestjs/common';
import { DatabaseProductsService } from './database-products.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class DatabaseProductsController {
  constructor(private readonly databaseService: DatabaseProductsService,

  ) { }

  @MessagePattern('get_products')
  async getProducts() {
    try {
      const products = await this.databaseService.getAllProducts();
      return { success: true, data: products };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @MessagePattern('get_products_dynamically')
  async getDynamicallyLoadedProducts(@Payload() params: { take: number; page: number; cursor?: string }) {
    return this.databaseService.getPaginatedProducts(params.take, params.page, params.cursor);
  }

  @MessagePattern('get_product_by_id')
  async getProductById(@Payload() data: { id: string }) {
    try {
      const product = await this.databaseService.getProductById(data.id);
      return { success: true, data: product };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @MessagePattern('get_product_by_name')
  async getProductByName(@Payload() data: { name: string }) {
    try {
      const products = await this.databaseService.getProductByName(data.name);
      return { success: true, data: products };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @MessagePattern('add_product')
  async createProduct(@Payload() data: any) {
    return this.databaseService.createProduct(data);
  }

  @MessagePattern('edit_product')
  async updateProduct(@Payload() data: { id: string;[key: string]: any }) {
    const { id, ...updateData } = data;
    return this.databaseService.updateProduct(id, updateData);
  }

  @MessagePattern('edit_image')
  async updateImage(@Payload() data: { productId: string; file: Express.Multer.File }) {
    return this.databaseService.updateImage(data.file, data.productId);
  }

  @MessagePattern('save_product_image')
  async saveImage(@Payload() data: { productId: string; file: Express.Multer.File }) {
    return this.databaseService.saveImage(data.file, data.productId);
  }

  @MessagePattern('delete_product_by_id')
  async deleteProduct(@Payload() data: { id: string }) {
    return this.databaseService.deleteProduct(data.id);
  }

  @MessagePattern('search_products')
  async searchProducts(@Payload() data: { filter: any; options?: any }) {
    return this.databaseService.searchProducts(data.filter, data.options);
  }

  @MessagePattern('get_product_count')
  async getProductCount(@Payload() data?: { filter: any }) {
    return this.databaseService.getProductCount(data?.filter);
  }
}