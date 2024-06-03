import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  AppContextProvider,
  useAppContext,
} from '@/contexts/AppContext';
import Layout from "@/components/Layout";

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
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}));

describe('AppContextProvider', () => {

  test('provides initial context values', () => {
    const TestComponent = () => {
      const { backDropOpen, mockazonMenuDrawerOpen } = useAppContext();
      return (
        <div>
          <span>backDropOpen: {backDropOpen.toString()}</span>
          <span>
            mockazonMenuDrawerOpen: {mockazonMenuDrawerOpen.toString()}
          </span>
        </div>
      );
    };

    render(
      <AppContextProvider>
        <TestComponent />
      </AppContextProvider>
    );
  });

  test('renders Layout with child component', () => {
    const ChildComponent = () => {
      return (
        <Layout>
          <div>Test Component</div>
        </Layout>
      );
    };

    render(
      <AppContextProvider>
        <ChildComponent />
      </AppContextProvider>
    );
  });
});
