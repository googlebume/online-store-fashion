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

export class OrderItemDTO {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class OrderDTO {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  items: OrderItemDTO[];

  @IsNumber()
  @Min(0)
  total: number;

  deliveryMethod: string;

  @IsString()
  address: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  promoCode?: string;
}

export class PromoCodeBasketItemDTO {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class ValidatePromoCodeDTO {
  @IsString()
  promoCode: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PromoCodeBasketItemDTO)
  items: PromoCodeBasketItemDTO[];
}

export class UpdatePromoCodeDTO {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  discountType?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountValue?: number;

  /** null — без обмеження використань */
  @IsOptional()
  usageLimit?: number | null;

  @IsOptional()
  @IsBoolean()
  isInfinite?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  /** null — скинути дату закінчення */
  @IsOptional()
  expiresAt?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicableProductTypes?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  minProductPrice?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxProductPrice?: number | null;
}

export class CreatePromoCodeDTO {
  @IsString()
  code: string;

  @IsString()
  discountType: string;

  @IsNumber()
  @Min(0)
  discountValue: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @IsOptional()
  @IsBoolean()
  isInfinite?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicableProductTypes?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  minProductPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxProductPrice?: number;
}
