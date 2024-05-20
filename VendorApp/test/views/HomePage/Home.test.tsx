import { fireEvent, render, screen } from '@testing-library/react';
import { LoginContext } from '@/contexts/LoginContext';
import { Home } from '../../../src/views/HomePage/Home';

it('Renders', async () => {
  const id = 'some id';
  const setId = () => {};
  localStorage.setItem('accessToken', 'some token');
  const accessToken = 'some token';
  const setAccessToken = () => {};
  render(
    <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
      <Home />
    </LoginContext.Provider>
  );
  expect(
    screen.queryAllByText('API Keys', { exact: false }).length
  ).toBeGreaterThan(0);
  localStorage.clear();
});
