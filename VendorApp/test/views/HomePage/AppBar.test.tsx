import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MyAppBar } from '../../../src/views/HomePage/AppBar';
import { jest } from '@jest/globals';
import { LoginContext } from '@/contexts/LoginContext';
it('Renders', async () => {
  render(<MyAppBar />);
  await screen.findByText('Sign Out', {
    exact: false,
  });
});

it('Sign Out button is clickable', async () => {
  const logSpy = jest.spyOn(global.console, 'log');
  let id = '';
  let accessToken = '';
  let setId = jest.fn();
  let setAccessToken = jest.fn();
  render(
    <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
        <MyAppBar />
    </LoginContext.Provider>);
  const signOut = await screen.findByText('Sign Out', {
    exact: false,
  });
  await fireEvent.click(signOut);
  waitFor(() => {expect(logSpy).toHaveBeenCalledWith('Sign Out')});
});
