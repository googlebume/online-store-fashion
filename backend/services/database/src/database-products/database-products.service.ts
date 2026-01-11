import { Injectable } from '@nestjs/common';
import { ProductRepository, ICreateProductInput, IUpdateProductInput } from '../repositories/product.repository';
import { IQueryOptions } from '../repositories/core/types';

@Injectable()
export class DatabaseProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getAllProducts(options?: IQueryOptions) {
    return this.productRepository.findAllWithAttributes(options);
  }

  async getProductById(id: string) {
    return this.productRepository.findByIdWithAttributes(id);
  }

  async getProductByName(name: string) {
    return this.productRepository.findByName(name);
  }

  async createProduct(data: ICreateProductInput) {
    try {
      const product = await this.productRepository.create(data);
      return {
        success: true,
        message: 'Product created successfully',
        product
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  async updateProduct(id: string, data: IUpdateProductInput) {
    try {
      const product = await this.productRepository.updateById(id, data);
      return {
        success: true,
        message: 'Product updated successfully',
        product
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  async saveImage(file: Express.Multer.File, productId: string) {
    try {
      const imageUrl = await this.productRepository.saveImage(file, productId);
      return {
        success: true,
        message: 'Image saved successfully',
        imageUrl
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  async updateImage(file: Express.Multer.File, productId: string) {
    try {
      const imageUrl = await this.productRepository.updateImage(file, productId);
      return {
        success: true,
        message: 'Image updated successfully',
        imageUrl
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  async deleteProduct(id: string) {
    try {
      await this.productRepository.deleteById(id);
      return {
        success: true,
        message: 'Product deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  async getPaginatedProducts(take: number, page: number, cursor?: string) {
    try {
      const result = await this.productRepository.findPaginated(
        {},
        {
          pagination: { limit: take, page, cursor },
          include: { attributes: true },
          orderBy: { id: 'desc' }
        }
      );
      return {
        success: true,
        ...result
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  async searchProducts(filter: any, options?: IQueryOptions) {
    try {
      const products = await this.productRepository.find(filter, {
        ...options,
        include: { attributes: true }
      });
      return {
        success: true,
        data: products
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  async getProductCount(filter?: any) {
    try {
      const count = await this.productRepository.count(filter);
      return {
        success: true,
        count
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}