import { AuthChecker } from 'type-graphql';
import type { NextApiRequest } from 'next';

import { AuthService } from './service';

export async function authChecker(
  context: NextApiRequest,
  authHeader: string
): Promise<boolean> {
  try {
    context.user = await new AuthService().check(authHeader);
    console.log(context.user);
  } catch (err) {
    return false;
  }
  return true;
}

export const nextAuthChecker: AuthChecker<NextApiRequest> = async ({
  context,
}) => {
  return await authChecker(context, context.req.headers.authorization);
};
