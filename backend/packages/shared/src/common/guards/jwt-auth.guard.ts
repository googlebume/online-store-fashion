import { Injectable, CanActivate, ExecutionContext, HttpException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
    ) { 
        // console.log('JwtAuthGuard constructor called');
        // console.log('Reflector:', !!this.reflector);
        // console.log('JwtService:', !!this.jwtService);
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        try {
            const authHeader = request.headers.authorization;
            if (!authHeader) {
                throw new UnauthorizedException({ message: 'Відсутній заголовок Authorization' });
            }

            const [bearer, token] = authHeader.split(' ');
            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({ message: 'Невірний токен' });
            }

            console.log('Token from header:', token);

            const verified = this.jwtService.verify(token);
            request.user = verified;

            if (!verified) {
                throw new UnauthorizedException({ message: 'Застарілий токен' });
            }
            
            console.log('User verified:', verified);
            return true;
        } catch (error: any) {
            console.error('JwtAuthGuard error:', error.message || error);
            throw new UnauthorizedException({ message: 'Не авторизований' });
        }
    }
}
