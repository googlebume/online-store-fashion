import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class DatabaseProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getAllProducts() {
    const products = await this.productRepository.findAll();
    // console.log("DB returns", products)
    return products;
  }

  async getProductById(id: number) {
    return this.productRepository.findById(id);
  }

  async getProductByName(name: string) {
    return this.productRepository.findByName(name);
  }

  editProduct(data: any) {
    return this.productRepository.editProduct(data);
  }
}