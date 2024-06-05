import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
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
  coverageDirectory: '<rootDir>/../.nyc_output/VendorApp',
  collectCoverage: true,
  coveragePathIgnorePatterns: ['src/pages/_app.tsx', 'src/pages/_document.tsx', 'LoginContext.tsx'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        outputPath: '<rootDir>/coverage/jest-report.html',
        pageTitle: 'Test Report',
        includeFailureMsg: true,
        includeConsoleLog: true,
      },
    ],
  ],
};

export default createJestConfig(customJestConfig);
