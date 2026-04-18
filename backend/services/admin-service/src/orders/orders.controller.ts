import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Roles } from '../common/decorators/roles-metadata.decorator';
import { OrdersService } from './orders.service';

@Controller('fashion/admin/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles('admin')
  @Get('')
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Roles('admin')
  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  @Roles('admin')
  @Post('add')
  createOrder(@Body() data: any) {
    return this.ordersService.createOrder(data);
  }

  @Roles('admin')
  @Post('edit/:id')
  updateOrder(@Param('id') id: string, @Body() data: { status?: string; address?: string; email?: string; total?: number }) {
    return this.ordersService.updateOrder(id, data);
  }

  @Roles('admin')
  @Post('status')
  updateOrderStatus(@Body() data: { orderId: string; status: string }) {
    return this.ordersService.updateOrderStatus(data.orderId, data.status);
  }

  @Roles('admin')
  @Delete('delete/:id')
  deleteOrder(@Param('id') id: string) {
    return this.ordersService.deleteOrder(id);
  }
}
