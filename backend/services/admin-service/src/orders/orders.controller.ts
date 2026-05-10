import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles-metadata.decorator';
import { OrdersService } from './orders.service';
import {
  orderSchema,
  successMessageSchema,
} from '@packages/shared/common/swagger/response-schemas';

@ApiTags('Admin Orders')
@ApiBearerAuth('bearer')
@Controller('fashion/admin/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles('admin')
  @Get('')
  @ApiOperation({ summary: 'Get all orders' })
  @ApiOkResponse({ description: 'All orders', schema: { type: 'array', items: orderSchema } })
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Roles('admin')
  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  @ApiParam({ name: 'id', example: '9f5051b7-5f5d-4f6e-9f35-2f3d9aa4f001' })
  @ApiOkResponse({ description: 'Order details', schema: orderSchema })
  getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  @Roles('admin')
  @Post('add')
  @ApiOperation({ summary: 'Create order from admin panel' })
  @ApiOkResponse({ description: 'Created order', schema: orderSchema })
  createOrder(@Body() data: any) {
    return this.ordersService.createOrder(data);
  }

  @Roles('admin')
  @Post('edit/:id')
  @ApiOperation({ summary: 'Update order fields by id' })
  @ApiParam({ name: 'id', example: '9f5051b7-5f5d-4f6e-9f35-2f3d9aa4f001' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'shipped' },
        address: { type: 'string', example: 'Kyiv, Khreshchatyk 1' },
        email: { type: 'string', example: 'buyer@example.com' },
        total: { type: 'number', example: 2499 },
      },
    },
  })
  @ApiOkResponse({ description: 'Updated order result', schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Order updated successfully' },
      data: orderSchema,
    },
  } })
  updateOrder(@Param('id') id: string, @Body() data: { status?: string; address?: string; email?: string; total?: number }) {
    return this.ordersService.updateOrder(id, data);
  }

  @Roles('admin')
  @Post('status')
  @ApiOperation({ summary: 'Update order status only' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['orderId', 'status'],
      properties: {
        orderId: { type: 'string', example: '9f5051b7-5f5d-4f6e-9f35-2f3d9aa4f001' },
        status: { type: 'string', example: 'completed' },
      },
    },
  })
  @ApiOkResponse({ description: 'Updated order status result', schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Order status updated successfully' },
      data: orderSchema,
    },
  } })
  updateOrderStatus(@Body() data: { orderId: string; status: string }) {
    return this.ordersService.updateOrderStatus(data.orderId, data.status);
  }

  @Roles('admin')
  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete order by id' })
  @ApiParam({ name: 'id', example: '9f5051b7-5f5d-4f6e-9f35-2f3d9aa4f001' })
  @ApiOkResponse({ description: 'Deletion result', schema: successMessageSchema })
  deleteOrder(@Param('id') id: string) {
    return this.ordersService.deleteOrder(id);
  }
}
