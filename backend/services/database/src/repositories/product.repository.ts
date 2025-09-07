import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs/promises'
import * as crypto from 'crypto';
import { Products } from '@prisma/client';
import { ImageFileHandler } from '@packages/shared/dist/utils/libs/files/image-file.handler'

@Injectable()
export class ProductRepository {
    private readonly imagesDir: string;

    constructor(
        private readonly prisma: PrismaService,
        private readonly imageFileHandler: ImageFileHandler,
    ) {
        this.imagesDir = path.resolve(process.cwd(), 'products');
    }

    async findById(id: string) {
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

    async editProduct(data: Products & { file?: Express.Multer.File, attributes: string }) {
        console.log('editing product .....')

        const attributes = JSON.parse(data?.attributes);
        try {
            if (typeof data.file === 'object') {
                await this.editImage(data.file, data.image);
            }
        } catch (error) {
            console.error('Error editing image:', error);
        }

        return this.prisma.products.update({
            where: { id: data.id },
            data: {
                name: data.name,
                brand: data.brand,
                description: data.description,
                price: +data.price,
                discount: +data.discount,
                attributes: {
                    update: [
                        {
                            where: { productsId: attributes.productsId },
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

    async addImage(file: Express.Multer.File, prodId: string) {
        const saveData = await this.imageFileHandler.saveImage(path.resolve(process.cwd(), 'products'), file)

        if (!saveData || !saveData?.success) {
            throw new Error('Не вдалося зберегти файл');
        }

        const [originName, extName] = saveData?.filename.split('.');

        try {
            await this.prisma.products.update({
                where: { id: prodId },
                data: {
                    image: `http://localhost:5002/products/${saveData?.filename}`,
                },
            });

            return { success: true };
        } catch (error) {
            console.error('Add image error:', error);
            return { success: false, message: error.message, fileHash: originName };
        }
    }

    async addProduct(data: Products & { attributes: string, image: Express.Multer.File }) {
        const attributes = JSON.parse(data.attributes);

        const createdProduct = await this.prisma.products.create({
            data: {
                name: data.name,
                description: data.description,
                price: +data.price,
                discount: +data.discount,
                brand: 'Generic Brand',
                image: '',
                attributes: {
                    create: [
                        {
                            type: attributes.type,
                            category: attributes.category,
                            color: attributes.color,
                            size: attributes.size,
                            material: 'Generic Material',
                            countryOfOrigin: 'Generic Country',
                            weight: 0,
                        }
                    ],
                }
            }
        });

        const fileHash = await (await this.addImage(data.image, createdProduct.id)).fileHash;
        if (fileHash) {
            await this.prisma.products.update({
                where: { id: createdProduct.id },
                data: {
                    image: `http://localhost:5000/products/${fileHash}.webp`
                }
            });
        }
    }

    async editImage(file: Express.Multer.File, imageURL: string) {
        const fileName = path.basename(imageURL);
        const fileExtname = path.extname(file.originalname);
        const filePath = path.join(this.imagesDir, fileName)

        if (fileExtname !== '.webp') throw new Error('Only .webp allowed');
        if (!fileName) throw new Error('Invalid imageURL format');

        try {
            await this.imageFileHandler.delete(filePath)
        } catch (err) {
            if (err.code !== 'ENOENT') {
                throw new Error('Error deleting old image');
            }
        }

        try {
            const buffer = Buffer.isBuffer(file.buffer)
                ? file.buffer
                : Buffer.from((file.buffer as { data: number[] }).data);

            await this.imageFileHandler.create(this.imagesDir, fileName, buffer)
        } catch (err) {
            throw new Error('Error writing new image');
        }

        return { success: true };
    }

    async deleteProductById(id: string) {
        const data = await this.prisma.products.findUnique({ where: { id: id } });
        if (!data) {
            throw new Error(`Product with id ${id} not found`);
        }
        const fileName = path.basename(data.image);
        try {
            await this.prisma.attributes.delete({ where: { productsId: data.id } });
        } catch (error) {
            throw new Error(`Failed to delete attributes for product with id ${data.id}: ${error.message}`);
        }
        try {
            await this.prisma.products.delete({ where: { id: data.id } });
        } catch (error) {
            throw new Error(`Failed to delete product with id ${data.id}: ${error.message}`);
        }

        try {
            await this.imageFileHandler.delete(path.join(this.imagesDir, fileName));
        } catch (error) {
            throw new Error(`Failed to delete image with product id ${data.id}. Image name - ${fileName}: ${error.message}`);
        }

        return { success: true, message: 'Product and image deleted successfully' };
    }

}