import { fireEvent, render, screen } from '@testing-library/react';
import { SignupForm } from '@/views/Signup/SignupForm';
import userEvent from '@testing-library/user-event';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { LoginForm } from '@/views/Signup/LoginForm';

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
        signup: { content: { message: 'Request Sent Successfully' } },
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

it('Fills out signin form and catches server error', async () => {
  render(<LoginForm navigate={setNavigate} />);
  await fillOutForm();
  server.close();
  fireEvent.click(screen.getAllByText('Login')[1]);
});
