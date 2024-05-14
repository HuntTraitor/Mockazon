import { ArgsType, Field, ObjectType } from 'type-graphql';
import { IsUUID } from 'class-validator';

// @ArgsType()
// export class Sub {
//   @Field()
//     sub!: string;
// }

@ObjectType()
export class ProductData {
  @Field()
    brand?: string;
  @Field()
    name?: string;
  @Field()
    rating?: string;
  @Field()
    price?: number;
  @Field()
    deliveryDate?: string;
  @Field()
    image?: string;
}

@ArgsType()
export class ProductId {
  @IsUUID()
  @Field()
    productId!: string;
}

@ObjectType()
export class Product {
  @IsUUID()
  @Field()
    id!: string;
  @Field(() => ProductData)
    data!: ProductData;
}
