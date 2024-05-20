import { Field, ObjectType, ArgsType } from 'type-graphql';
import { Matches, MinLength } from 'class-validator';

@ArgsType()
@ObjectType()
export class Credentials {
  @Field()
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
    email!: string;
  @Field()
    password!: string;
}

@ArgsType()
@ObjectType()
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
  @Matches(
    /[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/
  )
    id!: string;
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
