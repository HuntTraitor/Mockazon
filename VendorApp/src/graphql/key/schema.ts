import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Key {
  @Field()
    key!: string;
  @Field()
    vendor_id!: string;
  @Field()
    active!: boolean;
  @Field()
    blacklisted!: boolean;
}
