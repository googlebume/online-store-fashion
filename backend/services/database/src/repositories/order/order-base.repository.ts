import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeliveryMethod, Order, OrderItem, Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { OrderDTO, OrderItemDTO } from '@packages/shared/dist/src/dto/order.dto';
import { PrismaService } from "../../prisma.service";

@Injectable()
export class OrderBaseHandler {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async findById(id: string): Promise<Order> {
        try {
            const order = await this.prisma.order.findUnique({
                where: { id },
            });

            if (!order) {
                throw new HttpException(
                    "Такого замовлення не існує",
                    HttpStatus.NOT_FOUND,
                );
            }

            return order;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                throw new HttpException(
                    `Помилка бази даних: ${error.message}`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            throw new HttpException(
                "Внутрішня помилка сервера",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async add(data: OrderDTO) {
        console.log('Дані замовлення:', data);

        try {
            // ✅ Перетворення на enum DeliveryMethod
            const deliveryMethodMap: Record<string, DeliveryMethod> = {
                "Кур'єр": DeliveryMethod.Courier,
                'Самовивіз': DeliveryMethod.Pickup
            };

            const mappedDeliveryMethod = deliveryMethodMap[data.deliveryMethod];

            if (!mappedDeliveryMethod) {
                throw new HttpException(
                    `Невідомий спосіб доставки: ${data.deliveryMethod}`,
                    HttpStatus.BAD_REQUEST,
                );
            }
            
            const order = await this.prisma.order.create({
                data: {
                    // userId: data.userId ?? null, // ← null = гість
                    total: data.total,
                    deliveryMethod: mappedDeliveryMethod,
                    address: data.address,
                    email: data.email,
                    status: 'in progress',
                    items: {
                        create: data.items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
            });

            return {
                success: true,
                message: "Замовлення успішно додано",
                orderId: order.id
            };
        } catch (error) {
            console.error('Помилка при створенні замовлення:', error);

            if (error instanceof PrismaClientKnownRequestError) {
                throw new HttpException(
                    `Помилка бази даних: ${error.message}`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            throw new HttpException(
                "Внутрішня помилка сервера",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}