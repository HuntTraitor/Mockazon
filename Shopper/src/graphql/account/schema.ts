import { ObjectType, Field, Float, InputType } from 'type-graphql';

@InputType()
export class ShippingAddressInput {
  @Field()
    name!: string;

  @Field()
    addressLine1!: string;

  @Field()
    city!: string;

  @Field()
    state!: string;

  @Field()
    postalCode!: string;

  @Field()
    country!: string;
}

@ObjectType()
export class ShippingAddress {
  @Field()
    name!: string;

  @Field()
    addressLine1!: string;

  @Field()
    city!: string;

  @Field()
    state!: string;

  @Field()
    postalCode!: string;

  @Field()
    country!: string;
}

@InputType()
export class OrderInput {
  @Field()
    createdAt!: string;

  @Field(() => ShippingAddressInput)
    shippingAddress!: ShippingAddressInput;

  @Field()
    paymentMethod!: string;

  @Field(() => Float)
    subtotal!: number;

  @Field(() => Float)
    totalBeforeTax!: number;

  @Field(() => Float)
    tax!: number;

  @Field(() => Float)
    total!: number;
}

@ObjectType()
export class Order {
  @Field()
    id!: string;

  @Field()
    createdAt!: string;

  @Field(() => ShippingAddress)
    shippingAddress!: ShippingAddress;

  @Field()
    paymentMethod!: string;

  @Field(() => Float)
    subtotal!: number;

  @Field(() => Float)
    totalBeforeTax!: number;

  @Field(() => Float)
    tax!: number;

  @Field(() => Float)
    total!: number;
}
