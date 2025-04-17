import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('fashion')
export class LoginController {
    constructor(private readonly loginService: LoginService) { }

    hello() {
        this.loginService.hello();
        // return 'Request processed';
    }
}
