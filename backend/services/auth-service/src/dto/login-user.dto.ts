import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDTO {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    @MaxLength(25)
    email: string;

    @ApiProperty({ example: 'StrongPass123' })
    @IsString()
    @MinLength(8)
    password: string
}
