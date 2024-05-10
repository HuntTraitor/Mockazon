import { render, screen } from '@testing-library/react';

import { Home } from '../../../src/views/HomePage/Home';
import { LoginContext } from '@/contexts/Login';
import { PageContext } from '@/contexts/PageContext';

it('Renders...Access Key Exists', async () => {
  const accessToken = 'some old token';
  const setAccessToken = () => {};
  const id = 'some id';
  const setId = () => {};
  render(
    <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
      <Home />
    </LoginContext.Provider>
  );
  expect(screen.getAllByText('Users').length).not.toBe(0);
});

it('Renders Correct Page (Users)', async () => {
  const accessToken = 'some old token';
  const setAccessToken = () => {};
  const id = 'some id';
  const setId = () => {};
  const page = 'Users';
  const setPage = () => {};
  render(
    <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
      <PageContext.Provider value={{ page, setPage }}>
        <Home />
      </PageContext.Provider>
    </LoginContext.Provider>
  );
  expect(screen.getAllByText('Users').length).not.toBe(0);
});

it('Renders Correct Page (Requests)', async () => {
  const accessToken = 'some old token';
  const setAccessToken = () => {};
  const id = 'some id';
  const setId = () => {};
  const page = 'Requests';
  const setPage = () => {};
  render(
    <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
      <PageContext.Provider value={{ page, setPage }}>
        <Home />
      </PageContext.Provider>
    </LoginContext.Provider>
  );
  expect(screen.getAllByText('Requests').length).not.toBe(0);
});

it('Does not Render...Empty Access Key', async () => {
  const accessToken = '';
  const setAccessToken = () => {};
  const id = '';
  const setId = () => {};
  await render(
    <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
      <Home />
    </LoginContext.Provider>
  );

  expect(await screen.queryAllByText('Users').length).toBe(0);
});
