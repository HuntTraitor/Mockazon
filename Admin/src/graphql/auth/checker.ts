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

import { AuthChecker } from "type-graphql"
import type { NextApiRequest } from 'next'

import { AuthService } from "./service"

export async function authChecker(context: NextApiRequest, authHeader: string, roles: string[]): Promise<boolean> {
  try {
    context.user = await new AuthService().check(authHeader, roles)
  } catch (err) {
    return false
  }
  return true
}

export const nextAuthChecker: AuthChecker<NextApiRequest> = async (
  { context }, roles,) => 
{
  return await authChecker(context, context.req.headers.authorization, roles)
};
