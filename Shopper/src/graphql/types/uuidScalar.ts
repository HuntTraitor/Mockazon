import { GraphQLScalarType, Kind } from 'graphql';

const UUID = new GraphQLScalarType({
  name: 'UUID',
  description: 'UUID scalar type',
  parseValue(value: unknown) {
    return value as string;
  },
  serialize(value: unknown) {
    return value as string;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }
    return null;
  },
});

export default UUID;
