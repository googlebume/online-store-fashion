import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.products.findUnique({ where: { id } });
  }

  async findAll() {
    const products = await this.prisma.products.findMany();
    const attributes = await this.prisma.attributes.findMany();
    
    const combined = products.map(product => {
      const matchingAttribute = attributes.find(attr => attr.productsId === product.id);
      
      const attributesObject = matchingAttribute
        ? Object.fromEntries([
            ["type", matchingAttribute.type],
            ["category", matchingAttribute.category],
            ["color", matchingAttribute.color],
            ["size", matchingAttribute.size]
          ])
        : {};
      
      return {
        ...product,
        attributes: attributesObject
      };
    });
  
    return combined;
  }

//   async createProduct(name: string, price: number) {
//     return this.prisma.product.create({
//       data: { name, price },
//     });
//   }

//   async updateProduct(id: string, name?: string, price?: number) {
//     return this.prisma.product.update({
//       where: { id },
//       data: { name, price },
//     });
//   }

//   async deleteProduct(id: string) {
//     return this.prisma.product.delete({ where: { id } });
//   }
}
