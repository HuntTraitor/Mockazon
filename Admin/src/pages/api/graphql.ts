import { createYoga } from 'graphql-yoga';
import 'reflect-metadata'; // must come before buildSchema
import { buildSchemaSync } from 'type-graphql';

import { AccountResolver } from '../../graphql/account/resolver';
import { RequestResolver } from '../../graphql/request/resolver';
import { AuthResolver } from '../../graphql/auth/resolver';
import { nextAuthChecker } from '@/graphql/auth/checker';

const schema = buildSchemaSync({
  resolvers: [AccountResolver, RequestResolver, AuthResolver],
  validate: true,
  authChecker: nextAuthChecker,
});

export default createYoga({
  schema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: '/api/graphql',
});
