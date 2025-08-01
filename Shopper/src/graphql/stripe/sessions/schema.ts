import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from 'type-graphql';
import { IsUUID } from 'class-validator';
import UUID from '@/graphql/types/uuidScalar';

export enum Locale {
  en = 'en',
  es = 'es',
}

registerEnumType(Locale, {
  name: 'Locale', // this one is mandatory
  description: 'The supported locales', // this one is optional
});

@InputType()
export class Item {
  @IsUUID()
  @Field(() => UUID)
    productId!: string;

  @IsUUID()
  @Field(() => UUID)
    vendorId!: string;
}

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
  @Field(() => Item)
    metadata!: Item;
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
  @Field(() => Locale)
    locale!: Locale;
}

@ObjectType()
export class BlankOutput {}
