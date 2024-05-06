import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import Index, { getServerSideProps } from '../../src/pages/index';

it('Renders', async () => {
  render(<Index />);
});

it('Clicks translate', async () => {
  render(<Index />);
  await waitFor(() => fireEvent.click(screen.getByText('Cambiar a Español')));
  // wait for
  await waitFor(() => fireEvent.click(screen.getByText('Change to English')));
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

it('should fetch server side props with translations', async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  await getServerSideProps({ locale: null });
});
