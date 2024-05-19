import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import {
  AppContextProvider,
  useAppContext,
} from '../../src/contexts/AppContext';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('AppContextProvider', () => {
  const mockRouter = {
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

    expect(screen.getByText('backDropOpen: false')).toBeInTheDocument();
    expect(
      screen.getByText('mockazonMenuDrawerOpen: false')
    ).toBeInTheDocument();
  });

  test('updates context values', async () => {
    const TestComponent = () => {
      const {
        backDropOpen,
        setBackDropOpen,
        mockazonMenuDrawerOpen,
        setMockazonMenuDrawerOpen,
      } = useAppContext();
      return (
        <div>
          <span>backDropOpen: {backDropOpen.toString()}</span>
          <span>
            mockazonMenuDrawerOpen: {mockazonMenuDrawerOpen.toString()}
          </span>
          <button onClick={() => setBackDropOpen(true)}>Open BackDrop</button>
          <button onClick={() => setMockazonMenuDrawerOpen(true)}>
            Open Drawer
          </button>
        </div>
      );
    };

    render(
      <AppContextProvider>
        <TestComponent />
      </AppContextProvider>
    );

    userEvent.click(screen.getByText('Open BackDrop'));
    await waitFor(() => {
      expect(screen.getByText('backDropOpen: true')).toBeInTheDocument();
    });

    userEvent.click(screen.getByText('Open Drawer'));
    await waitFor(() => {
      expect(
        screen.getByText('mockazonMenuDrawerOpen: true')
      ).toBeInTheDocument();
    });
  });

  test('resets state on route change', () => {
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

    const handleRouteChange = mockRouter.events.on.mock.calls[0][1];

    handleRouteChange();
  });

  test('useAppContext throws error when used outside provider', () => {
    const TestComponent = () => {
      useAppContext();
      return <div>Test</div>;
    };

    expect(() => render(<TestComponent />)).toThrow(
      'useAppContext must be used within an AppContextProvider'
    );
  });
});
