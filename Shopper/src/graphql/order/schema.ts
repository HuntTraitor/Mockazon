import { Field, ObjectType, ID, Int } from 'type-graphql';
import { IsDate, IsPositive, IsUUID } from 'class-validator';
import type { UUID } from '../types';
import { ShippingAddress } from '@/graphql/account/schema';
import { Product } from '@/graphql/product/schema';

@ObjectType()
export class ShopperOrderProduct {
  @Field(() => ID)
  @IsUUID()
    id!: UUID;
  
  @Field()
    quantity!: number;
}

@ObjectType()
export class ShopperOrder {
  @Field(() => ID)
  @IsUUID()
    id!: UUID;

  @Field()
  @IsDate()
    createdAt!: Date;

  @Field(() => ShippingAddress)
    shippingAddress!: ShippingAddress;

  @Field()
    paymentMethod!: string;

  @Field()
    paymentDigits!: string;

  @Field()
  @IsPositive()
    subtotal!: number;

  @Field()
  @IsPositive()
    tax!: number;

  @Field()
  @IsPositive()
    total!: number;

  @Field(() => Boolean)
    shipped!: boolean;

  @Field(() => Boolean)
    delivered!: boolean;

  @Field(() => Date)
    deliveryTime!: Date;

  @Field(() => [Product])
    products!: Product[];
}
