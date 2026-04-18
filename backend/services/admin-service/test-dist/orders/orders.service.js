"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const order_client_1 = require("src/order.client");
let OrdersService = OrdersService_1 = class OrdersService {
    logger = new common_1.Logger(OrdersService_1.name);
    async getAllOrders() {
        this.logger.log('[getAllOrders] Requesting orders from order-service');
        const payload = await (0, rxjs_1.lastValueFrom)(order_client_1.orderClient.send('admin_get_all_orders', {}));
        this.logger.debug(`[getAllOrders] Response payload: ${JSON.stringify(payload)}`);
        return payload;
    }
    async getOrderById(id) {
        return await (0, rxjs_1.lastValueFrom)(order_client_1.orderClient.send('admin_get_order_by_id', { id }));
    }
    async createOrder(data) {
        return await (0, rxjs_1.lastValueFrom)(order_client_1.orderClient.send('admin_create_order', data));
    }
    async updateOrder(id, data) {
        return await (0, rxjs_1.lastValueFrom)(order_client_1.orderClient.send('admin_update_order', { id, data }));
    }
    async updateOrderStatus(orderId, status) {
        return await (0, rxjs_1.lastValueFrom)(order_client_1.orderClient.send('admin_update_order_status', { orderId, status }));
    }
    async deleteOrder(id) {
        return await (0, rxjs_1.lastValueFrom)(order_client_1.orderClient.send('admin_delete_order', { id }));
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)()
], OrdersService);
//# sourceMappingURL=orders.service.js.map