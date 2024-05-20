import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    // Add any additional module mappings here if needed
  },
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  collectCoverageFrom: [
    'src/**/*.{[jt]s,[jt]sx}',
    '!**/node_modules/**',
    '!src/graphql/*/resolver.ts',
    '!src/graphql/auth/checker.ts',
  ],
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    'src/pages/_app.tsx',
    'src/pages/_document.tsx',
    // ok to ignore schema.ts as there's an issue with next and graphql
    'schema.ts'
  ],
  testMatch: ['**/test/**/?(*.)+(spec|test).[jt]s?(x)'],
};

export default createJestConfig(customJestConfig);
