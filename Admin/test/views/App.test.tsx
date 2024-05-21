import { render } from '@testing-library/react';

import { App } from '../../src/views/App';

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { basePath: '' },
}));

it('Renders', async () => {
  render(<App />);
});
