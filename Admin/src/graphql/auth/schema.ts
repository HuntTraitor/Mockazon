/*
#######################################################################
#
# Copyright (C) 2022-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/

import { Field, ObjectType, ArgsType } from "type-graphql"
import { Length } from "class-validator";

@ArgsType()
export class Credentials {
  @Field()
  @Length(4, 20)
    email!: string
  @Field()
  @Length(2, 20)
    password!: string
}

@ObjectType()
export class Authenticated {
  @Field()
    name!: string
  @Field()
    accessToken!: string
}
