import { ObjectType, Field, InputType } from 'type-graphql';

@InputType()
export class ShippingAddressInput {
  @Field()
    name?: string;

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
    name?: string;

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