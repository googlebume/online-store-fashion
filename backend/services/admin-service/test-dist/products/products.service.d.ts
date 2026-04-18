export declare class ProductsService {
    getAll(): Promise<any>;
    editOneProduct(data: any, file?: Express.Multer.File): Promise<{
        success: boolean;
        data: any;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    addOneProduct(data: any, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        product: any;
    } | {
        success: boolean;
        message: any;
        product?: undefined;
    }>;
    deleteProductById(id: string): Promise<any>;
}
