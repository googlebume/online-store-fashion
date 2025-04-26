import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterUserDTO } from '../dto/register-user.dto'

@Controller('fashion')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) { }

    @Post('auth')
    async getUserData(@Body() userData: RegisterUserDTO) {
        return await this.registerService.getUserData(userData);
    }

}
