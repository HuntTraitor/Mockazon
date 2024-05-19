import MockazonMenuDrawer from '@/views/MockazonMenuDrawer';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { AppContext } from '@/contexts/AppContext';

test('triggers onClose when backdrop is clicked', async () => {
  const setMockazonMenuDrawerOpen = jest.fn();
  const AppContextProps = {
    backDropOpen: false,
    setBackDropOpen: jest.fn(),
    mockazonMenuDrawerOpen: true, // Initially open the drawer
    setMockazonMenuDrawerOpen,
  };

  render(
    <AppContext.Provider value={AppContextProps}>
      <MockazonMenuDrawer />
    </AppContext.Provider>
  );

  const backdrop = document.querySelector('.MuiBackdrop-root');
  if (backdrop) {
    fireEvent.click(backdrop);
  }

  expect(setMockazonMenuDrawerOpen).toHaveBeenCalledWith(false);
});
