import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GoogleCredentialDTO {
  @ApiProperty({ example: 'google-jwt-credential' })
  @IsString()
  @IsNotEmpty()
  credential!: string;

  @ApiPropertyOptional({ example: 'google-client-id.apps.googleusercontent.com' })
  @IsString()
  @IsOptional()
  clientId?: string;

  @ApiPropertyOptional({ example: 'btn' })
  @IsString()
  @IsOptional()
  select_by?: string;
}
