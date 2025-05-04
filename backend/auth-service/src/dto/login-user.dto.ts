import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDTO {
    @IsEmail()
    @MaxLength(25)
    email: string;

    @IsString()
    @MinLength(8)
    password: string
}