import { Field, ObjectType, ArgsType } from 'type-graphql';

@ArgsType()
export class Credentials {
  @Field()
    sub!: string;
  @Field()
    email!: string;
  @Field()
    name!: string;
}

@ArgsType()
export class Sub {
  @Field()
    sub!: string;
}

@ObjectType()
export class Authenticated {
  @Field()
    name!: string;
  @Field()
    accessToken!: string;
}

@ObjectType()
export class AuthenticatedWithId {
  @Field()
    id!: string;
  @Field()
    name!: string;
  @Field()
    accessToken!: string;
  @Field()
    role!: string;
}

@ObjectType()
export class Message {
  @Field()
    content!: string;
}

@ObjectType()
export class SignUpResponse {
  @Field()
    id!: string;
  @Field()
    name!: string;
  @Field()
    email!: string;
  @Field()
    role!: string;
  @Field()
    sub!: string;
}

export type SignUpResponseOrError = SignUpResponse | Message | null;

// @ObjectType()
// class SignUpData {
//   @Field()
//     name!: string;
//   @Field()
//     email!: string;
//   @Field()
//     role!: string;
//   @Field()
//     sub!: string;
// }

// @ObjectType()
// export class SignUp {
//   @Field()
//     id!: string;
//   @Field(() => SignUpData)
//     data!: SignUpData;
// }
