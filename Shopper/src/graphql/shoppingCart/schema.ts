import { ArgsType, Field, ObjectType } from 'type-graphql';
import { IsUUID } from 'class-validator';

@ObjectType()
export class ShoppingCartData {
  @Field()
    quantity!: string;
}

@ArgsType()
export class ShopperId {
  @IsUUID()
  @Field()
    shopperId!: string;
}

@ArgsType()
export class AddItem {
  @IsUUID()
  @Field()
    productId!: string;
  @Field()
    quantity!: string;
}

@ArgsType()
export class RemoveItem {
  @IsUUID()
  @Field()
    productId!: string;
}

@ObjectType()
export class ShoppingCartItem {
  @IsUUID()
  @Field()
    id!: string;
  @IsUUID()
  @Field()
    product_id!: string;
  @IsUUID()
  @Field()
    shopper_id!: string;
  @Field(() => ShoppingCartData)
    data!: ShoppingCartData;
}
