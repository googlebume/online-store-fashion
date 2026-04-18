import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    getAllOrders(): Promise<any>;
    getOrderById(id: string): Promise<any>;
    createOrder(data: any): Promise<any>;
    updateOrder(id: string, data: {
        status?: string;
        address?: string;
        email?: string;
        total?: number;
    }): Promise<any>;
    updateOrderStatus(data: {
        orderId: string;
        status: string;
    }): Promise<any>;
    deleteOrder(id: string): Promise<any>;
}
