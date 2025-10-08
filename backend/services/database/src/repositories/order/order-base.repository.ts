import { Order, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

class OrderBaseHandler {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    add(data: Order) {

    }
}