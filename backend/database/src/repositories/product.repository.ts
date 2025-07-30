import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs/promises'

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


    async editProduct(data: any) {
        console.log('editing product .....')

        const attributes = JSON.parse(data.attributes);
        try {
            if (typeof data.file === 'object') {
                await this.editImage(data.file, data.image);
            }
        } catch (error) {
            console.error('Error editing image:', error);
        }

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

    async addImage(file: Express.Multer.File, prodId: number) {
        const dirPath = path.join(__dirname, '..', '..', 'products');
        const fileHash = await bcrypt.hash(file.originalname, 10);
        const extension = path.extname(file.originalname);
        const fileName = `${fileHash}${extension}`;
        const filePath = path.join(dirPath, fileName);

        try {
            try {
                await fs.access(dirPath);
            } catch {
                await fs.mkdir(dirPath, { recursive: true });
            }

            try {
                await fs.access(filePath);
                throw new Error('File already exists');
            } catch {
            }

            await fs.writeFile(filePath, file.buffer);

            try {
                await fs.access(filePath);
            } catch {
                return { success: false };
            }

            await this.prisma.products.update({
                where: { id: +prodId },
                data: {
                    image: `http://localhost:5000/products/${fileName}`,
                },
            });

            return { success: true };
        } catch (error) {
            console.error('Add image error:', error);
            return { success: false, message: error.message };
        }
    }

    async editImage(file: Express.Multer.File, imageURL: string) {
    const dirPath = path.join(__dirname, '..', '..', '..', 'product-service', 'products');
    const fileName = path.basename(imageURL, path.extname(imageURL));
    const fileExtname = path.extname(file.originalname);

    if (fileExtname !== '.webp') throw new Error('Only .webp allowed');
    if (!fileName) throw new Error('Invalid imageURL format');

    const filePath = path.join(dirPath, `${fileName}${fileExtname}`);

    try {
        await fs.access(filePath);
        await fs.rm(filePath);
    } catch (err: any) {
        if (err.code !== 'ENOENT') {
            console.error('Помилка видалення:', err);
            throw new Error('Error deleting old image');
        }
    }

    try {
        const buffer = Buffer.isBuffer(file.buffer)
            ? file.buffer
            : Buffer.from((file.buffer as { data: number[] }).data);

        await fs.writeFile(filePath, buffer);
        console.log('Успішно записано!');
    } catch (err) {
        console.error('Помилка запису файлу:', err);
        throw new Error('Error writing new image');
    }

    return { success: true };
}

}
