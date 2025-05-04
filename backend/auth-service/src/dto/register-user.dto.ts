import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
export class RegisterUserDTO{
    @IsString()
    @MaxLength(20)
    name: string;

    @IsEmail()
    @MaxLength(25)
    email: string;

    @IsString()
    @MinLength(8)
    password: string
}