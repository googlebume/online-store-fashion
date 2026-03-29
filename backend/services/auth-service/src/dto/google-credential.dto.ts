import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GoogleCredentialDTO {
  @IsString()
  @IsNotEmpty()
  credential!: string;

  @IsString()
  @IsOptional()
  clientId?: string;

  @IsString()
  @IsOptional()
  select_by?: string;
}
