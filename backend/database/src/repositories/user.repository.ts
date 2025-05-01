import { Injectable } from "@nestjs/common";
import { Prisma } from "../../prisma/generated/prisma-client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findByID(id: number){
        return this.prisma.user.findUnique({where: {id}})
    }
    async findByEmail(email: string){
        return this.prisma.user.findFirst({where: {email}})
    }

    async findAll(){
        return this.prisma.user.findMany()
    }

    async addNewUser(data: {name: string; email: string; password:string}){
        return await this.prisma.user.create({data})
    }

    async loginUser(email: string, password: string){
        return await this.prisma.user.findFirst({
            where: {
              email,
              password
            }
          });
    }
}