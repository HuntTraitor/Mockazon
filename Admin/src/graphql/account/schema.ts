import { Field, ObjectType } from 'type-graphql';
import { IsUUID, IsEmail } from 'class-validator';

@ObjectType()
export class Account {
  @Field()
  @IsUUID()
    id!: string;
  @Field()
  @IsEmail()
    email!: string;
  @Field()
    name!: string;
  @Field()
    role!: string;
  @Field()
    suspended!: boolean;
}
