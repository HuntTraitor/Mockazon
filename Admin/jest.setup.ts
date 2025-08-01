// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.ts`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/jest-globals';

import { TextEncoder } from 'node:util';
import 'cross-fetch/polyfill';

global.TextEncoder = TextEncoder;
