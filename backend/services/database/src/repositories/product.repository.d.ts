import { PrismaService } from '../prisma.service';
import { Products } from '@prisma/client';
export declare class ProductRepository {
    private readonly prisma;
    private readonly imagesDir;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        name: string;
        id: string;
        brand: string;
        price: number;
        discount: number;
        description: string;
        image: string;
    } | null>;
    findByName(name: string): Promise<{
        attributes: any;
        name: string;
        id: string;
        brand: string;
        price: number;
        discount: number;
        description: string;
        image: string;
    }[]>;
    findAll(): Promise<{
        attributes: {
            [k: string]: any;
        };
        name: string;
        id: string;
        brand: string;
        price: number;
        discount: number;
        description: string;
        image: string;
    }[]>;
    changeArrToObj(arr: any): {
        [k: string]: any;
    };
    editProduct(data: Products & {
        file?: Express.Multer.File;
        attributes: string;
    }): Promise<{
        name: string;
        id: string;
        brand: string;
        price: number;
        discount: number;
        description: string;
        image: string;
    }>;
    addImage(file: Express.Multer.File, prodId: string): Promise<{
        success: boolean;
        message?: undefined;
        fileHash?: undefined;
    } | {
        success: boolean;
        message: any;
        fileHash: string;
    }>;
    addProduct(data: Products & {
        attributes: string;
        image: Express.Multer.File;
    }): Promise<void>;
    editImage(file: Express.Multer.File, imageURL: string): Promise<{
        success: boolean;
    }>;
    deleteImage(imageURL: string): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteProduct(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteProductById(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
