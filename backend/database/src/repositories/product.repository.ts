import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: number) {
        return this.prisma.products.findUnique({ where: { id } });
    }

    async findByName(name: string) {
        const parsedName: string = name.split('-').slice(0, 2).join(' ');
        // console.log('parsedName:', parsedName);
    
        const products = await this.prisma.products.findMany({
            where: {
                name: {
                    startsWith: parsedName
                }
            }
        });
    
        if (!products.length) {
            throw new Error('Products not found');
        }
    
        const productIds = products.map(p => p.id);
    
        const attributes = await this.prisma.attributes.findMany({
            where: {
                productsId: {
                    in: productIds
                }
            }
        });
    
        const attributesMap = attributes.reduce((acc, attr) => {
            if (!acc[attr.productsId]) acc[attr.productsId] = [];
            acc[attr.productsId].push(attr);
            return acc;
        }, {} as Record<number, any[]>);
    
        return products.map(product => {
            console.log('product.id', product.id);
            console.log('attributesMap', attributesMap[product.id]);
            return {
                ...product,
                attributes: attributesMap[product.id]
            };
        });
    }
    
    

    async findAll() {
        const products = await this.prisma.products.findMany();
        const attributes = await this.prisma.attributes.findMany();

        const combined = products.map(product => {
            const matchingAttribute = attributes.find(attr => attr.productsId === product.id);

            const attributesObject = this.changeArrToObj(matchingAttribute);
            

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




    changeArrToObj(arr) {
        const attributesObject = arr
            ? Object.fromEntries([
                ["type", arr.type],
                ["category", arr.category],
                ["color", arr.color],
                ["size", arr.size]
            ])
            : {};
            return attributesObject
    }
}
