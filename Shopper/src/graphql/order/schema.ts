import { Field, ObjectType, ID } from 'type-graphql';
import { IsDate, IsPositive, IsUUID } from 'class-validator';
import type { UUID } from '../types';
import { ShippingAddress } from '@/graphql/account/schema';

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

  @Field(() => [String])
    products!: UUID[];
}
