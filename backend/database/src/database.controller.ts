import { Controller } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) { }

  @MessagePattern('get_products')
  async getProducts() {
    const products = await this.databaseService.getAllProducts();
    return products;
  }
  
  @MessagePattern('get_product_by_id')
  async getProductById(data: { id: number }) {
    return this.databaseService.getProductById(data.id);
  }
}
