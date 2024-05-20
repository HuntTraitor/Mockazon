import { IsEmail, IsUUID } from 'class-validator';
import { Field, ObjectType, ArgsType, InputType } from 'type-graphql';

@ArgsType()
export class LoginInput {
  @Field({ nullable: true })
    sub?: string;

  @Field({ nullable: true })
  @IsEmail()
    email?: string;

  @Field({ nullable: true })
    password?: string;
}
@InputType()
export class Credentials {
  @Field()
    name!: string;
  @Field()
  @IsEmail()
    email!: string;
  @Field()
    password!: string;
}

@InputType()
export class GoogleCredentials {
  @Field()
    sub!: string;
  @Field()
  @IsEmail()
    email!: string;
  @Field()
    name!: string;
}

@ArgsType()
export class SignUpArgs {
  @Field(() => Credentials, { nullable: true })
    // FIXME: Weird coverage issue
    credentials?: Credentials;

  @Field(() => GoogleCredentials, { nullable: true })
    // FIXME: Weird coverage issue
    googleCredentials?: GoogleCredentials;
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
  @IsUUID()
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
  @IsUUID()
    id!: string;
  @Field()
    name!: string;
  @Field()
  @IsEmail()
    email!: string;
  @Field()
    role!: string;
  @Field()
    sub!: string;
  @Field()
    accessToken!: string;
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
