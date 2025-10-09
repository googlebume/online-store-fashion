import { Injectable } from '@nestjs/common';
import { OrderDTO } from 'src/dto/order.dto';
import { OrderBaseHandler } from 'src/repositories/order/order-base.repository';

@Injectable()
export class DatabaseOrdersService {
    constructor(
        private readonly orderBaseHandler: OrderBaseHandler
    ){}

    async findById(id: string) {
        return await this.orderBaseHandler.findById(id)
    } 

    async add(data: OrderDTO){
        return await this.orderBaseHandler.add(data)
    }
}
