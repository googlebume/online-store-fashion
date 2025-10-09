import { HttpException, HttpStatus } from "@nestjs/common";
import { Order, Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { OrderDTO } from "src/dto/order.dto";
import { PrismaService } from "src/prisma.service";

class OrderBaseHandler {
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

    add(data: OrderDTO) {
        try {
            this.prisma.order.create({
                data: {
                    userId: data.userId,
                    total: data.total,
                    deliveryMethod: data.deliveryMethod,
                    address: data.address,
                    email: data.email,
                    status: data.status,
                    items: {
                        create: data.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                            product: {
                                connect: { id: item.productId }
                            }
                        }))
                    }
                },
            })
        } catch (error) {

        }
    }
}