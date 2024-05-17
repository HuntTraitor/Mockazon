// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.ts`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/jest-globals';

import { TextEncoder } from 'node:util';
import 'cross-fetch/polyfill';
import mockRouter from 'next-router-mock';

global.TextEncoder = TextEncoder;

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { basePath: '' },
}));

jest.mock('next/router', () => jest.requireActual('next-router-mock'))