import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles-metadata.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) return true;

        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('Відсутній заголовок Authorization');
        }

        const [bearer, token] = authHeader.split(' ');
        if (bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException('Невірний формат токена');
        }

        let user: any;
        try {
            user = this.jwtService.verify(token);
        } catch (err) {
            throw new UnauthorizedException('Недійсний або прострочений токен');
        }

        if (!user.roles || user.roles.length === 0) {
            throw new ForbiddenException('У користувача немає жодної ролі');
        }

        request.user = user;

        const hasAccess = user.roles.some((role: string) =>
            requiredRoles.includes(role)
        );

        if (!hasAccess) {
            throw new ForbiddenException('У вас недостатньо прав');
        }

        return true;
    }
}
