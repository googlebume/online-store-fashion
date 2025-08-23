import { Injectable, CanActivate, ExecutionContext, HttpException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Guard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const response = context.switchToHttp().getResponse()

        try {
            const authHeader = response.headers.autorization;
            const { bearer, token } = authHeader.split(' ');
            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({ message: 'Невірний токен' });
            }

            const verified = this.jwtService.verify(token);
            response.user = verified;
            if (!verified) {
                throw new UnauthorizedException({ message: 'Застарілий токен' });
            }
            
            return true
        } catch (error) {
            throw new UnauthorizedException({ message: 'Не авторизований' });
        }
    }
}