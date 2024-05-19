import { Kind } from 'graphql';
import UUID from '../../src/graphql/types/uuidScalar';

describe('UUID Scalar', () => {
  it('should parse value', () => {
    const value = '123e4567-e89b-12d3-a456-426614174000';
    expect(UUID.parseValue(value)).toBe(value);
  });

  it('should serialize value', () => {
    const value = '123e4567-e89b-12d3-a456-426614174000';
    expect(UUID.serialize(value)).toBe(value);
  });

  it('should parse literal of kind STRING', () => {
    const ast = { kind: Kind.STRING, value: '123e4567-e89b-12d3-a456-426614174000' };
    expect(UUID.parseLiteral(ast)).toBe(ast.value);
  });

  it('should return null for non-string literal', () => {
    const ast = { kind: Kind.INT, value: '123e4567-e89b-12d3-a456-426614174000' };
    expect(UUID.parseLiteral(ast)).toBeNull();
  });
});
