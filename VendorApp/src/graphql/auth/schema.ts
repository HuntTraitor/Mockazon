import { Field, ObjectType, ArgsType } from 'type-graphql';
import { Matches, MinLength } from 'class-validator';

@ArgsType()
export class Credentials {
  @Field()
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
    email!: string;
  @Field()
    password!: string;
}

@ArgsType()
export class SignupCredentials {
  @Field()
    name!: string;
  @Field()
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
    email!: string;
  @Field()
  @MinLength(6)
    password!: string;
}

@ObjectType()
export class Authenticated {
  @Field()
    name!: string;
  @Field()
    accessToken!: string;
}

@ObjectType()
export class Message {
  @Field()
    content!: string;
}
