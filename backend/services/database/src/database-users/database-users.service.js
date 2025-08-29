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
exports.DatabaseUsersService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../repositories/user.repository");
let DatabaseUsersService = class DatabaseUsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getAllUsers() {
        return this.userRepository.findAll();
    }
    async getUserByID(id) {
        return this.userRepository.findByID(id);
    }
    async getUserByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    async addNewUser(data) {
        return this.userRepository.addNewUser(data);
    }
    async loginUser(email, password) {
        return this.userRepository.loginUser(email, password);
    }
};
exports.DatabaseUsersService = DatabaseUsersService;
exports.DatabaseUsersService = DatabaseUsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], DatabaseUsersService);
//# sourceMappingURL=database-users.service.js.map