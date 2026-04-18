import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getAllProducts(): Promise<any>;
    editProduct(image: Express.Multer.File, body: any): Promise<{
        success: boolean;
        data: any;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    addProduct(image: Express.Multer.File, body: any): Promise<{
        success: boolean;
        message: string;
        product: any;
    } | {
        success: boolean;
        message: any;
        product?: undefined;
    }>;
    deleteProduct(id: string): Promise<any>;
}
