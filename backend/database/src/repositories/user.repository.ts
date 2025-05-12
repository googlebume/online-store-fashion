// import { Injectable, NotFoundException } from "@nestjs/common";
// import { Prisma } from "../../prisma/generated/prisma-client";
// import { PrismaService } from "src/prisma.service";
// import * as bcrypt from 'bcryptjs';

// @Injectable()
// export class UserRepository {
//     constructor(private readonly prisma: PrismaService) { }

//     async findByID(id: number) {
//         return this.prisma.user.findUnique({ where: { id } })
//     }
//     async findByEmail(email: string) {
//         const user = await this.prisma.user.findFirst({
//             where: { email: email }
//         });
//         if (user?.email != email) {
//             throw new NotFoundException(`Користувача з email ${email} не знайдено`);
//         }

//         return user;
//     }

//     async findAll() {
//         return this.prisma.user.findMany()
//     }

//     async addNewUser(data: { name: string; email: string; password: string }) {
//         try {
//             await this.prisma.user.create({ data });
//             return true;
//         } catch (err) {
//             if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
//                 return false;
//             }
//             throw err; // пропуск інших помилок
//         }
//     }


//     // async loginUser(email: string, password: string) {
//     //     return await this.prisma.user.findFirst({
//     //         where: {
//     //             email,
//     //             password
//     //         }
//     //     });
//     // }

//     async loginUser(email: string, password: string) {
//         const user = await this.prisma.user.findFirst({
//             where: {
//                 email,
//             },
//         });

//         if (!user) {
//             return null;
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);

//         if (!isPasswordValid) {
//             return null;
//         }

//         return user;
//     }
// }

// src/user.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByID(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(`Користувача з email ${email} не знайдено`);
    }
    return user;
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async addNewUser(data: { name: string; email: string; password: string }) {
    try {
      await this.prisma.user.create({ data });
      return true;
    } catch (err) {
      if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
        return false;
      }
      console.error('Error in addNewUser:', err); // Логуємо помилку
      throw new Error(`Помилка створення користувача: ${err.message}`);
    }
  }

  async loginUser(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}