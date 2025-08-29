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
exports.DatabaseUsersController = void 0;
const common_1 = require("@nestjs/common");
const database_users_service_1 = require("./database-users.service");
const microservices_1 = require("@nestjs/microservices");
let DatabaseUsersController = class DatabaseUsersController {
    databaseUsersService;
    constructor(databaseUsersService) {
        this.databaseUsersService = databaseUsersService;
    }
    async getAllUsers() {
        return this.databaseUsersService.getAllUsers();
    }
    async getUserByID(data) {
        return this.databaseUsersService.getUserByID(data.id);
    }
    async getUserByEmail(data) {
        return this.databaseUsersService.getUserByEmail(data.email);
    }
    async addNewUser(data) {
        return this.databaseUsersService.addNewUser(data);
    }
    async loginUser({ email, password }) {
        return this.databaseUsersService.loginUser(email, password);
    }
};
exports.DatabaseUsersController = DatabaseUsersController;
__decorate([
    (0, microservices_1.MessagePattern)('get_all_users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DatabaseUsersController.prototype, "getAllUsers", null);
__decorate([
    (0, microservices_1.MessagePattern)('get_user_by_id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DatabaseUsersController.prototype, "getUserByID", null);
__decorate([
    (0, microservices_1.MessagePattern)('get_user_by_email'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DatabaseUsersController.prototype, "getUserByEmail", null);
__decorate([
    (0, microservices_1.MessagePattern)('add_new_user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DatabaseUsersController.prototype, "addNewUser", null);
__decorate([
    (0, microservices_1.MessagePattern)('login_user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DatabaseUsersController.prototype, "loginUser", null);
exports.DatabaseUsersController = DatabaseUsersController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [database_users_service_1.DatabaseUsersService])
], DatabaseUsersController);
//# sourceMappingURL=database-users.controller.js.map