import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        try {
            const authHeader = request.headers.authorization;
            if (!authHeader) return true;

            const [bearer, token] = authHeader.split(' ');
            if (bearer !== 'Bearer' || !token) return true;

            const verified = this.jwtService.verify(token);
            if (verified) {
                request.user = verified;
            }
        } catch {
            // invalid/expired token — treat as guest
        }

        return true;
    }
}
