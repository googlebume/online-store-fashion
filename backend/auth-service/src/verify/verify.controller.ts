import { Body, Controller, Get, Post } from '@nestjs/common';
import { VerifyService } from './verify.service';
import { RegisterUserDTO } from 'src/dto/register-user.dto';
import { LoginUserDTO } from 'src/dto/login-user.dto';

@Controller('fashion')
export class VerifyController {
    constructor(private readonly verifyService: VerifyService) {}
    
}