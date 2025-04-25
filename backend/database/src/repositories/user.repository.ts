import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findByID(id: number){
        return this.prisma.user.findUnique({where: {id}})
    }

    async findAll(){
        return this.prisma.user.findMany()
    }

    async addNewUser(data: Prisma.UserCreateInput){
        return await this.prisma.user.create({data})
    }
}