import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import path from 'path';
import * as bcrypt from 'bcryptjs';
import fs from 'fs';

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
                ["productsId", arr.productsId],
                ["type", arr.type],
                ["category", arr.category],
                ["color", arr.color],
                ["size", arr.size]
            ])
            : {};
        return attributesObject
    }


    editProduct(data: any) {
        const attributes = JSON.parse(data.attributes);

        return this.prisma.products.update({
            where: { id: +data.id },
            data: {
                name: data.name,
                brand: data.brand,
                description: data.description,
                price: +data.price,
                discount: +data.discount,
                attributes: {
                    update: [
                        {
                            where: { productsId: +attributes.productsId },
                            data: {
                                type: attributes.type,
                                category: attributes.category,
                                color: attributes.color,
                                size: attributes.size,
                            }

                        }
                    ],
                }
            },
        });
    }

    addImage(file: Express.Multer.File, prodId: number) {
        const dirPath = path.join(__dirname, '..', '..', 'products');
        const fileName = bcrypt.hashSync(file.originalname, 10)
        const filePath = path.join(dirPath, fileName);

        if (fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            // throw new Error('Please create products directory');
        }
        if (fs.existsSync(filePath)) {
            throw new Error('File already exists');
        }
        fs.writeFileSync(filePath, file.buffer);
        if (fs.existsSync(filePath)) {
            this.prisma.products.update({
                where: { id: +prodId },
                data: {
                    image: `http://localhost:5000/products/${fileName}.${path.extname(file.originalname)}`,
                }
            });
            return {
                success: true,
            }
        }
        return {
            success: false,
        }
    }

    editImage(file: Express.Multer.File, prodId: number, imageURL: string) {
        const dirPath = path.join(__dirname, '..', '..', 'products');
        const fileName = imageURL.split('/').pop()?.split('.').shift();

        
    }
}
