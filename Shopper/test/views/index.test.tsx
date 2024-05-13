import { render } from '@testing-library/react';

import Index, { getServerSideProps } from '../../src/pages/index';

// https://chat.openai.com/share/0c95f9af-f8b8-49a7-b104-efd929b218e7
jest.mock('next/router', () => ({
  useRouter: () => ({
    basePath: '',
    pathname: '/',
    query: {},
    asPath: '/',
    locale: 'en',
    locales: ['en', 'es'],
    defaultLocale: 'en',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
  }),
}));

jest.mock('@fontsource/open-sans', () => {
  return {};
});

it('Renders', async () => {
  render(<Index />);
});

jest.mock('next-i18next/serverSideTranslations', () => ({
  serverSideTranslations: jest.fn().mockReturnValue({
    en: {
      common: {
        title: 'Mock Title',
      },
    },
  }),
}));

it('should fetch server side props with translations', async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  await getServerSideProps({ locale: 'en' });
});

it('should fetch server side props with translations and null locale', async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  await getServerSideProps({ locale: null });
});
