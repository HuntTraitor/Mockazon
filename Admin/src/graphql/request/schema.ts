import { Field, ObjectType } from 'type-graphql';
import { Matches, IsUUID } from 'class-validator';

@ObjectType()
export class Request {
  @Field()
  @IsUUID()
    id!: string;
  @Field()
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
    email!: string;
  @Field()
    name!: string;
  @Field()
    role!: string;
  @Field()
    suspended!: boolean;
}
