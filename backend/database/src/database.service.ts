import { Injectable } from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';

@Injectable()
export class DatabaseService {
  constructor(private readonly productRepository: ProductRepository) {}

  // Додаємо методи для роботи з продуктами
  // async getAllProducts() {
  //   return this.productRepository.findAll();
  // }
  async getAllProducts() {
    const products = await this.productRepository.findAll();
    return products;
  }

  async getProductById(id: number) {
    return this.productRepository.findById(id);
  }
}