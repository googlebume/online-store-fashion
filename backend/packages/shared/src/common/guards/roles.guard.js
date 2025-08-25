"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_metadata_decorator_1 = require("../decorators/roles-metadata.decorator");
const jwt_1 = require("@nestjs/jwt");
let RolesGuard = class RolesGuard {
    reflector;
    jwtService;
    constructor(reflector, jwtService) {
        this.reflector = reflector;
        this.jwtService = jwtService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        try {
            const requiredRoles = this.reflector.getAllAndOverride(roles_metadata_decorator_1.ROLES_KEY, [
                context.getHandler(),
                context.getClass()
            ]);
            if (!requiredRoles)
                return true;
            const authHeader = request.headers.authorization;
            const { bearer, token } = authHeader.split(' ');
            if (bearer !== 'Bearer' || !token) {
                throw new common_1.UnauthorizedException({ message: 'Невірний токен' });
            }
            const user = this.jwtService.verify(token);
            request.user = user;
            return user.roles.some((role) => requiredRoles.includes(role));
        }
        catch (err) {
            throw new common_1.HttpException('У вас недостатньо прав', common_1.HttpStatus.FORBIDDEN);
        }
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        jwt_1.JwtService])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map