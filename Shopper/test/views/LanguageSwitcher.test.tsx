import LanguageSwitcher from '@/views/LanguageSwitcher';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

const pushMock = jest.fn();
let locale = 'en';

jest.mock('next/router', () => ({
  useRouter: () => ({
    basePath: '',
    pathname: '/',
    query: {},
    asPath: '/',
    locale: locale,
    locales: ['en', 'es'],
    defaultLocale: 'en',
    push: pushMock,
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
  }),
}));

describe('Language Switcher', () => {
  it('Renders successfully', async () => {
    render(<LanguageSwitcher />);
    await screen.findByText('EN');
  });

  it('Clicking the language switcher opens the language choices', async () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByLabelText('Language Container'));
    await screen.findByText('English');
    await screen.findByText('Español');
  });

  it('Selecting a new language changes the locale', async () => {
    render(<LanguageSwitcher />);
    pushMock.mockImplementation(() => Promise.resolve());
    fireEvent.click(screen.getByLabelText('Language Container'));
    fireEvent.click(screen.getByText('Español'));
    expect(pushMock).toHaveBeenCalledWith('/', '/', { locale: 'es' });

    fireEvent.click(screen.getByLabelText('Language Container'));
    fireEvent.click(screen.getByText('English'));
    expect(pushMock).toHaveBeenCalledWith('/', '/', { locale: 'en' });
  });

  it('Closes the language choices when the mouse leaves', async () => {
    render(<LanguageSwitcher />);
    fireEvent.mouseEnter(screen.getByLabelText('Language Container'));
    fireEvent.mouseLeave(screen.getByLabelText('Language Container'));

    await waitFor(() => {
      expect(screen.queryByText('English')).toBeNull();
    });
  });

  it('Does not close if mouse re-enters before timeout', async () => {
    render(<LanguageSwitcher />);
    fireEvent.mouseEnter(screen.getByLabelText('Language Container'));
    fireEvent.mouseLeave(screen.getByLabelText('Language Container'));
    fireEvent.mouseEnter(screen.getByLabelText('Language Container'));

    await waitFor(() => {
      expect(screen.queryByText('English')).not.toBeNull();
    });
  });

  it('Renders in spanish for the spanish locale', async () => {
    locale = 'es';
    render(<LanguageSwitcher />);
    await screen.findByText('ES');
  });
});
