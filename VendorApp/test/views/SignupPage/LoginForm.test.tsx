import { fireEvent, render, screen } from '@testing-library/react';
import { SignupForm } from '@/views/Signup/SignupForm';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { LoginForm } from '@/views/Signup/LoginForm';
import { LoginContext } from '@/contexts/LoginContext';
import { graphql, HttpResponse } from 'msw';
import React from 'react';

let returnError = false;

const handlers = [
  graphql.query('login', () => {
    if (returnError) {
      return HttpResponse.json({
        errors: [
          {
            message: 'Some Error',
          },
        ],
      });
    }
    return HttpResponse.json({
      data: {
        login: { content: { accessToken: 'some token' } },
      },
    });
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
beforeEach(() => {
  returnError = false;
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const fillOutForm = async () => {
  const emailInput = screen
    .getByLabelText('email-input')
    ?.querySelector('input');
  if (emailInput) {
    await userEvent.type(emailInput, 'Test@gmail.com');
    expect(emailInput.value).toBeDefined();
  }
  const passwordInput = screen
    .getByLabelText('password-input')
    ?.querySelector('input');
  if (passwordInput) {
    await userEvent.type(passwordInput, 'password1234');
    expect(passwordInput.value).toBeDefined();
  }
};

const setNavigate = () => {};

it('Renders log in form correctly', async () => {
  render(<LoginForm navigate={setNavigate} />);
  expect(screen.getAllByText('Login', { exact: false })).toBeDefined();
  expect(screen.getByText('Email', { exact: false })).toBeDefined();
  expect(screen.getAllByText('Password', { exact: false })).toBeDefined();
});

it('Fills out login form and clicks on request', async () => {
  render(<LoginForm navigate={setNavigate} />);
  await fillOutForm();
  fireEvent.click(screen.getAllByText('Login')[1]);
});

it('Fills out signin form and errors on a request', async () => {
  render(<LoginForm navigate={setNavigate} />);
  await fillOutForm();
  returnError = true;
  fireEvent.click(screen.getAllByText('Login')[1]);
});

it('Sends out signin form', async () => {
  // server.use(
  //   http.post(URL, async () => {
  //     return HttpResponse.json({}, { status: 401 });
  //   })
  // );
  // window.alert = () => {
  //   alerted = true;
  // };
  const id: string = 'some id';
  const setId = () => {};
  const accessToken: string = '';
  const setAccessToken = () => {};
  render(
    <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
      <LoginForm navigate={setNavigate} />
    </LoginContext.Provider>
  );
  await fillOutForm();
  returnError = false;
  await fireEvent.click(screen.getAllByText('Login')[1]);
});

it('Fills out signin form and catches server error', async () => {
  render(<LoginForm navigate={setNavigate} />);
  await fillOutForm();
  server.close();
  fireEvent.click(screen.getAllByText('Login')[1]);
});
