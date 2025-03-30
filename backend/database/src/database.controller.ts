import { Controller } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) { }

  @MessagePattern('get_products')  // Отримати всі товари
  async getProducts() {
    console.log('Отримано запит get_products');
    const products = await this.databaseService.getAllProducts();
    console.log('Відповідь із database:', products);
    return products;
  }

  // Додатково можна додати метод для отримання одного продукту
  @MessagePattern('get_product_by_id')
  async getProductById(data: { id: number }) {
    return this.databaseService.getProductById(data.id);
  }
}
