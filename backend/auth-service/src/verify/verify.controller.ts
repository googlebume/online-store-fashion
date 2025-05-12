import { Body, Controller, Get, Post } from '@nestjs/common';
import { VerifyService } from './verify.service';

@Controller('fashion')
export class VerifyController {
    constructor(private readonly verifyService: VerifyService) {}

    // @Get('verify')
    // async sendCode() {
    //     return this.verifyService.sendVerificationCode()
    // }
    @Post('verify')
    async verifyCode(@Body() userCode:string) {
        return this.verifyService.veryfyCode(userCode)
    }
}