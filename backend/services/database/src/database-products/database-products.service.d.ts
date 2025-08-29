import { ProductRepository } from '../repositories/product.repository';
export declare class DatabaseProductsService {
    private readonly productRepository;
    constructor(productRepository: ProductRepository);
    getAllProducts(): Promise<{
        attributes: {
            [k: string]: any;
        };
        id: string;
        name: string;
        brand: string;
        price: number;
        discount: number;
        description: string;
        image: string;
    }[]>;
    getProductById(id: string): Promise<{
        id: string;
        name: string;
        brand: string;
        price: number;
        discount: number;
        description: string;
        image: string;
    } | null>;
    getProductByName(name: string): Promise<{
        attributes: any;
        id: string;
        name: string;
        brand: string;
        price: number;
        discount: number;
        description: string;
        image: string;
    }[]>;
    editProduct(data: any): Promise<{
        id: string;
        name: string;
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
    deleteProsuctById(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
