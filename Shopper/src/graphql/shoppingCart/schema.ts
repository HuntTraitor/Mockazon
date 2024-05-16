import { ArgsType, Field, ObjectType } from 'type-graphql';
import { IsUUID } from 'class-validator';

// @ArgsType()
// export class Sub {
//   @Field()
//     sub!: string;
// }

@ObjectType()
export class ShoppingCartData {
  @Field()
  quantity!: number;
}

@ArgsType()
export class ShopperId {
  @IsUUID()
  @Field()
  shopperId!: string;
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
  @IsUUID()
  @Field()
  vendor_id!: string;
  @Field(() => ShoppingCartData)
  data!: ShoppingCartData;
}
