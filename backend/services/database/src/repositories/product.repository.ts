import { Injectable } from '@nestjs/common';
import { BaseRepository } from './core/base-repository.abstract';
import { PrismaService } from './../prisma.service';
import { Products, Attributes } from '@prisma/client';
import { ICreateInput, IUpdateInput, IQueryOptions } from './core/types';
import { ErrorHandler } from './core/error-handler';
import { ImageFileHandler } from '@packages/shared/dist/utils/libs/files/image-file.handler';
import * as path from 'path';
import {
    ProductType,
    ProductCategory,
    ProductColor,
    Size,
} from '@prisma/client';


export interface IProductWithAttributes extends Products {
    attributes?: Attributes | Record<string, any>;
}

export interface ICreateProductInput extends ICreateInput<Products> {
    name: string;
    price: number;
    brand: string;
    description: string;
    discount?: number;
    image?: string;
    attributes?: {
        type?: string;
        category?: string;
        color?: string;
        size?: string;
        material?: string;
        countryOfOrigin?: string;
        weight?: number;
    };
}

export interface IUpdateProductInput extends IUpdateInput<Products> {
    name?: string;
    price?: number;
    brand?: string;
    description?: string;
    discount?: number;
    image?: string;
    attributes?: Record<string, any>;
}

@Injectable()
export class ProductRepository extends BaseRepository<Products> {
    private readonly imagesDir: string;

    constructor(
        private readonly prisma: PrismaService,
        private readonly imageFileHandler: ImageFileHandler
    ) {
        super();
        this.imagesDir = path.resolve(process.cwd(), 'products');
    }

    protected getModel(): any {
        return this.prisma.products;
    }

    async findByIdWithAttributes(id: string): Promise<IProductWithAttributes | null> {
        try {
            return await this.findById(id, {
                include: {
                    attributes: true,
                    reviews: true,
                    analytics: true,
                },
            });
        } catch (error) {
            ErrorHandler.handleError(error, 'Product');
        }
    }

    async findByName(namePattern: string): Promise<IProductWithAttributes[]> {
        try {
            const parsedName: string = namePattern.split('-').slice(0, 2).join(' ');

            const products = await this.find(
                {
                    name: {
                        startsWith: parsedName,
                    },
                },
                {
                    include: {
                        attributes: true,
                    },
                }
            );

            return products;
        } catch (error) {
            ErrorHandler.handleError(error, 'Product');
        }
    }

    async findAllWithAttributes(options?: IQueryOptions): Promise<IProductWithAttributes[]> {
        try {
            return await this.findAll({
                ...options,
                include: {
                    attributes: true,
                },
            });
        } catch (error) {
            ErrorHandler.handleError(error, 'Product');
        }
    }

    override async create(data: ICreateProductInput): Promise<Products> {
        try {
            const { attributes, ...productData } = data;
            const brand = productData.brand || 'Generic Brand';

            return await this.prisma.products.create({
                data: {
                    ...productData,
                    brand,
                    discount: productData.discount || 0,
                    image: productData.image || '',
                    ...(attributes && {
                        attributes: {
                            create: [
                                {
                                    type: attributes.type as ProductType,
                                    category: attributes.category as ProductCategory,
                                    color: attributes.color as ProductColor,
                                    size: attributes.size as Size,
                                    material: attributes.material ?? 'Generic Material',
                                    countryOfOrigin: attributes.countryOfOrigin ?? 'Generic Country',
                                    weight: attributes.weight ?? 0,
                                },
                            ],
                        },
                    }),
                },
            });
        } catch (error) {
            ErrorHandler.handleError(error, 'Product');
        }
    }

    override async updateById(
    id: string | number,
    data: IUpdateProductInput
): Promise<Products> {
    try {
        const { attributes, event, ...productData } = data;

        let parsedAttributes: any | undefined;

        if (attributes) {
            if (Array.isArray(attributes)) {
                parsedAttributes =
                    typeof attributes[0] === 'string'
                        ? JSON.parse(attributes[0])[0]
                        : attributes[0];
            } else if (typeof attributes === 'string') {
                parsedAttributes = JSON.parse(attributes)[0];
            } else {
                parsedAttributes = attributes;
            }
        }

        return await this.prisma.products.update({
            where: { id: id as string },
            data: {
                ...productData,
                discount: productData.discount !== undefined
                    ? Number(productData.discount)
                    : undefined,
                price: productData.price !== undefined
                    ? Number(productData.price)
                    : undefined,

                ...(parsedAttributes && {
                    attributes: {
                        update: {
                            where: { productsId: id as string },
                            data: {
                                type: parsedAttributes.type,
                                category: parsedAttributes.category,
                                color: parsedAttributes.color,
                                size: parsedAttributes.size,
                                brand: parsedAttributes.brand,
                                material: parsedAttributes.material,
                                countryOfOrigin: parsedAttributes.countryOfOrigin,
                                weight: parsedAttributes.weight,
                            },
                        },
                    },
                }),
            },
        });
    } catch (error) {
        ErrorHandler.handleError(error, 'Product');
    }
}


    override async deleteById(id: string | number): Promise<void> {
        try {
            const product = await this.findById(id as string);

            if (!product) {
                throw new Error(`Product with id ${id} not found`);
            }

            await this.prisma.attributes.deleteMany({
                where: { productsId: product.id },
            });

            await this.prisma.products.delete({
                where: { id: product.id },
            });

            if (product.image) {
                const fileName = path.basename(product.image);
                try {
                    await this.imageFileHandler.delete(path.join(this.imagesDir, fileName));
                } catch (error) {
                    console.error(`Failed to delete image ${fileName}:`, error);
                }
            }
        } catch (error) {
            ErrorHandler.handleError(error, 'Product');
        }
    }

    async saveImage(file: Express.Multer.File, productId: string): Promise<string> {
        try {
            const saveData = await this.imageFileHandler.saveImage(this.imagesDir, file);

            if (!saveData || !saveData.success) {
                throw new Error('Failed to save image');
            }

            const imageUrl = `http://localhost:5002/products/${saveData.filename}`;

            await this.prisma.products.update({
                where: { id: productId },
                data: { image: imageUrl },
            });

            return imageUrl;
        } catch (error) {
            ErrorHandler.handleError(error, 'Product');
        }
    }

    async updateImage(file: Express.Multer.File, productId: string): Promise<string> {
        try {
            const product = await this.findById(productId as string);

            if (!product) {
                throw new Error(`Product with id ${productId} not found`);
            }

            if (product.image) {
                const fileName = path.basename(product.image);
                try {
                    await this.imageFileHandler.delete(path.join(this.imagesDir, fileName));
                } catch (error) {
                    console.error(`Failed to delete old image: ${error.message}`);
                }
            }

            return this.saveImage(file, productId);
        } catch (error) {
            ErrorHandler.handleError(error, 'Product');
        }
    }

    async countByFilter(filter?: Record<string, any>): Promise<number> {
        try {
            return this.count(filter);
        } catch (error) {
            ErrorHandler.handleError(error, 'Product');
        }
    }
}