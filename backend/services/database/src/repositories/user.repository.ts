import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findByID(id: string) {
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
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        // createdAt: true,
        role: true,
      }
      // omit: {
      //   password: true,
      // },
    });
  }

  async addNewUser(data: { name: string; email: string; password: string }) {
    try {
      await this.prisma.user.create({ data });
      return true;
    } catch (err) {
      if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
        return false;
      }
      console.error('Error in addNewUser:', err);
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
    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  async deleteUser(id) {
    try {
      await this.prisma.user.delete({where: {id: id}})
      return {
        success: true,
        message: "User deleted"
      }
    } catch (error) {
      throw new HttpException("Такого юзера не існує", HttpStatus.FORBIDDEN)
    }
    
  }
}