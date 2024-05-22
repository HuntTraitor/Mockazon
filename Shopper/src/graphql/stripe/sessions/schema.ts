import { ArgsType, Field, InputType, ObjectType } from 'type-graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class ShopperId {
  @IsUUID()
  @Field()
    shopperId!: string;
}

@InputType()
export class StripeProductData {
  @Field()
    name!: string;
  @Field(() => [String])
    images!: string[];
}

@InputType()
export class PriceData {
  @Field()
    currency!: string;
  @Field()
    unit_amount!: number;
  @Field()
    product_data!: StripeProductData;
}

@InputType()
export class LineItem {
  @Field()
    price_data!: PriceData;
  @Field()
    quantity!: number;
}

@ObjectType()
export class Session {
  @Field()
    id!: string;
  @Field()
    url!: string;
}

@ArgsType()
export class CheckoutSessionInput {
  @Field(() => [LineItem])
    lineItems!: LineItem[];
  @Field(() => ShopperId)
    shopperId!: ShopperId;
  @Field()
    origin!: string;
}

@ObjectType()
export class BlankOutput {}
