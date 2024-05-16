import { ArgsType, Field, ObjectType, Int } from 'type-graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class GetProductsArgs {
  @Field({ nullable: true })
    vendorId?: string;

  @Field({ nullable: true })
    active?: boolean;

  @Field(() => Int, { nullable: true })
    page?: number;

  @Field(() => Int, { nullable: true })
    pageSize?: number;

  @Field({ nullable: true })
    search?: string;

  @Field({ nullable: true })
    orderBy?: string;

  @Field({ nullable: true })
    descending?: boolean;
}

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
