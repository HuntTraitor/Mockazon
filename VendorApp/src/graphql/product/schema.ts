import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ProductInfo {
  @Field()
    name!: string;
  @Field()
    price!: string;
}

@ObjectType()
export class Product {
  @Field()
    id!: string
  @Field()
    data!: ProductInfo;
}