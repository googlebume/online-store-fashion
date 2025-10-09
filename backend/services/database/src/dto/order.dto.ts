import { DeliveryMethod } from "@prisma/client"
import { IsArray, IsBoolean, IsEmail, isEmail, IsEnum, IsNumber, IsString, ValidateNested } from "class-validator"


export class OrderItemDTO {
    @IsString()
    productId

    @IsNumber()
    quantity

    @IsNumber()
    price
}

export class OrderDTO {
    @IsString()
    userId

    @IsArray()
    @ValidateNested({ each: true })
    items: OrderItemDTO

    @IsNumber()
    total

    @IsEnum(DeliveryMethod)
    deliveryMethod: DeliveryMethod

    @IsString()
    address

    @IsEmail()
    email

    @IsBoolean()
    status
}