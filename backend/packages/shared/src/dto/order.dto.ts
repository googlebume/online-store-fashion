import { DeliveryMethod } from "@prisma/client"
import { IsArray, IsBoolean, IsEmail, isEmail, IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator"


export class OrderItemDTO {
    @IsUUID()
    productId

    @IsNumber()
    quantity

    @IsNumber()
    price
}

export class OrderDTO {
    @IsString()
    @IsOptional()
    userId

    @IsArray()
    @ValidateNested({ each: true })
    items: OrderItemDTO[]

    @IsNumber()
    total

    // @IsEnum(DeliveryMethod)
    deliveryMethod: string

    @IsString()
    address

    @IsEmail()
    email
}