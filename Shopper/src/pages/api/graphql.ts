import { createYoga } from 'graphql-yoga';
import 'reflect-metadata'; // must come before buildSchema
import { buildSchemaSync } from 'type-graphql';

import { AuthResolver } from '@/graphql/auth/resolver';
import { nextAuthChecker } from '@/graphql/auth/checker';

const schema = buildSchemaSync({
  resolvers: [AuthResolver],
  validate: true,
  authChecker: nextAuthChecker,
});

export default createYoga({
  schema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: '/api/graphql',
  // context: (req, res) => ({
  //   ...req,
  //   ...res,
  //   onError: errorMiddleware, // Apply error middleware
  // }),
});

// const errorMiddleware = (error: any, context: any) => {
//   // Log the error or perform any other error handling logic
//   console.error(error);
//
//   // You can also modify the error message or format it differently
//   return error;
// };
