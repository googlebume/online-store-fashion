import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderDTO } from '@packages/shared/dist/src/dto/order.dto';
import { lastValueFrom } from 'rxjs';
import { databaseClient } from 'src/database.client';

@Injectable()
export class OrderingService {

    async add(order: OrderDTO) {
        try {
            const isSuccess = await lastValueFrom(databaseClient.send("add_order", order)) 
            return isSuccess
        } catch (error) {
            throw new HttpException("Помилка додавання продукту в кошик", HttpStatus.BAD_REQUEST)
        }
        
    }
}
