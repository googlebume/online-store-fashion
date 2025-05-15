import { Body, Controller, Get, Post } from '@nestjs/common';
import { VerifyService } from './verify.service';
import { RegisterUserDTO } from 'src/dto/register-user.dto';
import { LoginUserDTO } from 'src/dto/login-user.dto';

@Controller('fashion')
export class VerifyController {
    constructor(private readonly verifyService: VerifyService) {}

    // @Post('login/init')
    // async initLogin(@Body() userData: LoginUserDTO){
    //     try {
    //         console.log(userData.email)
    //         await this.registerService.setUserData(userData);
    //         await this.registerService.sendCode();
    //         return { success: true };
    //     } catch (error) {
    //         return {
    //             success: false,
    //             message: 'Помилка при ініціалізації реєстрації',
    //             error: error.message || 'Невідома помилка',
    //         };
    //     }
    // }

    
}