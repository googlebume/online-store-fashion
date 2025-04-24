import { Injectable } from "@nestjs/common";
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

    async addNewUser(data){
        this.prisma.user.create(data)
    }
}