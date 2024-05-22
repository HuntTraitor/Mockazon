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

import { Query, Resolver, Args } from "type-graphql"

import { Credentials, Authenticated } from "./schema"
import { AuthService } from "./service"

@Resolver()
export class AuthResolver {
  @Query(() => Authenticated)
  async login(
    @Args() credentials: Credentials,
  ): Promise<Authenticated> {
    return new AuthService().login(credentials)
  }
}
