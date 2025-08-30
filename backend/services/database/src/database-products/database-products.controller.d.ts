import { DatabaseProductsService } from './database-products.service';
export declare class DatabaseProductsController {
    private readonly databaseService;
    constructor(databaseService: DatabaseProductsService);
    getProducts(): Promise<{
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
    getProductById(data: {
        id: string;
    }): Promise<{
        name: string;
        id: string;
        brand: string;
        price: number;
        discount: number;
        description: string;
        image: string;
    } | null>;
    getProductByName(data: {
        name: string;
    }): Promise<{
        attributes: any;
        name: string;
        id: string;
        brand: string;
        price: number;
        discount: number;
        description: string;
        image: string;
    }[]>;
    editProduct(data: any): Promise<{
        name: string;
        id: string;
        brand: string;
        price: number;
        discount: number;
        description: string;
        image: string;
    }>;
    editImage(file: Express.Multer.File, imageURL: string): Promise<{
        success: boolean;
    }>;
    addProduct(data: any): Promise<void>;
    deleteProductById(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
