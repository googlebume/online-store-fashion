import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemDTO {
  @ApiProperty({ example: '9f5051b7-5f5d-4f6e-9f35-2f3d9aa4f001' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 1599 })
  @IsNumber()
  @Min(0)
  price: number;
}

export class OrderDTO {
  @ApiPropertyOptional({ example: 'fa2ab114-bf38-43d0-b0dc-4fe6cd34f001' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ type: () => [OrderItemDTO] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  items: OrderItemDTO[];

  @ApiProperty({ example: 3198 })
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty({ example: 'courier' })
  deliveryMethod: string;

  @ApiProperty({ example: 'Kyiv, Khreshchatyk 1' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'buyer@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'SPRING10' })
  @IsOptional()
  @IsString()
  promoCode?: string;
}

export class PromoCodeBasketItemDTO {
  @ApiProperty({ example: '9f5051b7-5f5d-4f6e-9f35-2f3d9aa4f001' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class ValidatePromoCodeDTO {
  @ApiProperty({ example: 'SPRING10' })
  @IsString()
  promoCode: string;

  @ApiProperty({ type: () => [PromoCodeBasketItemDTO] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PromoCodeBasketItemDTO)
  items: PromoCodeBasketItemDTO[];
}

export class UpdatePromoCodeDTO {
  @ApiProperty({ example: '9f5051b7-5f5d-4f6e-9f35-2f3d9aa4f001' })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({ example: 'SPRING10' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ example: 'percentage' })
  @IsOptional()
  @IsString()
  discountType?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountValue?: number;

  /** null — без обмеження використань */
  @ApiPropertyOptional({ example: 100, nullable: true })
  @IsOptional()
  usageLimit?: number | null;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isInfinite?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  /** null — скинути дату закінчення */
  @ApiPropertyOptional({ example: '2026-12-31T23:59:59.000Z', nullable: true })
  @IsOptional()
  expiresAt?: string | null;

  @ApiPropertyOptional({ example: ['hoodie', 'shirt'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicableProductTypes?: string[];

  @ApiPropertyOptional({ example: 1000, nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minProductPrice?: number | null;

  @ApiPropertyOptional({ example: 5000, nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxProductPrice?: number | null;
}

export class CreatePromoCodeDTO {
  @ApiProperty({ example: 'SPRING10' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'percentage' })
  @IsString()
  discountType: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  discountValue: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isInfinite?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: '2026-12-31T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({ example: ['hoodie', 'shirt'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicableProductTypes?: string[];

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minProductPrice?: number;

  @ApiPropertyOptional({ example: 5000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxProductPrice?: number;
}
