import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "../../prisma/generated/prisma-client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByID(id: number) {
        return this.prisma.user.findUnique({ where: { id } })
    }
    async findByEmail(email: string) {
        const user = await this.prisma.user.findFirst({
            where: { email: email }
        });
        if (user?.email != email) {
            return false
            throw new NotFoundException(`Користувача з email ${email} не знайдено`);
        }

        return user;
    }

    async findAll() {
        return this.prisma.user.findMany()
    }

    async addNewUser(data: { name: string; email: string; password: string }) {
        try {
            await this.prisma.user.create({ data });
            return true;
        } catch (err) {
            if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
                // Email already exists
                return false;
            }
            throw err; // Пропускаємо інші помилки
        }
    }
    

    async loginUser(email: string, password: string) {
        return await this.prisma.user.findFirst({
            where: {
                email,
                password
            }
        });
    }
}