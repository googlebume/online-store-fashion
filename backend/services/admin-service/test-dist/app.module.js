"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("./users/users.module");
const users_service_1 = require("./users/users.service");
const products_module_1 = require("./products/products.module");
const products_service_1 = require("./products/products.service");
const orders_module_1 = require("./orders/orders.module");
const orders_service_1 = require("./orders/orders.service");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("@packages/shared/common/guards/jwt-auth.guard");
const roles_guard_1 = require("@packages/shared/common/guards/roles.guard");
const jwt_1 = require("@nestjs/jwt");
const register_jwt_1 = require("@packages/config/dist/register-jwt");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            jwt_1.JwtModule.register((0, register_jwt_1.registerJwt)(register_jwt_1.basePipline)),
        ],
        providers: [
            users_service_1.UsersService,
            products_service_1.ProductsService,
            orders_service_1.OrdersService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map