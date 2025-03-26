import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

//   async findById(id: string) {
//     return this.prisma.product.findUnique({ where: { id } });
//   }

//   async findAll() {
//     return this.prisma.product.findMany();
//   }

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
