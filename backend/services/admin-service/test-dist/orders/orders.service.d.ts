export declare class OrdersService {
    private readonly logger;
    getAllOrders(): Promise<any>;
    getOrderById(id: string): Promise<any>;
    createOrder(data: any): Promise<any>;
    updateOrder(id: string, data: {
        status?: string;
        address?: string;
        email?: string;
        total?: number;
    }): Promise<any>;
    updateOrderStatus(orderId: string, status: string): Promise<any>;
    deleteOrder(id: string): Promise<any>;
}
