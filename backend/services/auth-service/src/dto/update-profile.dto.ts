import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(25)
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
