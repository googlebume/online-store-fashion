import { Request, Response, NextFunction } from "express";
import { HttpException, HttpStatus } from "@nestjs/common";

export const AuthFieldsLengthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    // Перевірка на порожні значення полів
    if (!name || !email || !password) {
        throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST);
    }

    // Перевірка довжини кожного поля
    if (name.length > 20) {
        throw new HttpException('Name field character threshold exceeded', HttpStatus.CONFLICT);
    }
    if (email.length > 25) {
        throw new HttpException('Email field character threshold exceeded', HttpStatus.CONFLICT);
    }
    if (password.length > 20) {
        throw new HttpException('Password field character threshold exceeded', HttpStatus.CONFLICT);
    }

    // Якщо всі перевірки пройшли успішно, передаємо запит далі
    next();
};
