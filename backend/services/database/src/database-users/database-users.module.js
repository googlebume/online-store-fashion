"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseUsersModule = void 0;
const common_1 = require("@nestjs/common");
const database_users_service_1 = require("./database-users.service");
const database_users_controller_1 = require("./database-users.controller");
const user_repository_1 = require("../repositories/user.repository");
const prisma_service_1 = require("../prisma.service");
let DatabaseUsersModule = class DatabaseUsersModule {
};
exports.DatabaseUsersModule = DatabaseUsersModule;
exports.DatabaseUsersModule = DatabaseUsersModule = __decorate([
    (0, common_1.Module)({
        controllers: [database_users_controller_1.DatabaseUsersController],
        providers: [database_users_service_1.DatabaseUsersService, user_repository_1.UserRepository, prisma_service_1.PrismaService],
    })
], DatabaseUsersModule);
//# sourceMappingURL=database-users.module.js.map