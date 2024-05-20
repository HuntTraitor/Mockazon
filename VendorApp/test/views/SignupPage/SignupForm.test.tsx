import { fireEvent, render, screen } from '@testing-library/react';
import { SignupForm } from '@/views/Signup/SignupForm';
import userEvent from '@testing-library/user-event';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { LoginContext } from '@/contexts/LoginContext';

let returnError = false;

const handlers = [
  graphql.query('signup', () => {
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
  const nameInput = screen.getByLabelText('name-input')?.querySelector('input');
  if (nameInput) {
    await userEvent.type(nameInput, 'Test Name');
    expect(nameInput.value).toBeDefined();
  }
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
  const repeatPasswordInput = screen
    .getByLabelText('repeatpassword-input')
    ?.querySelector('input');
  if (repeatPasswordInput) {
    await userEvent.type(repeatPasswordInput, 'password1234');
    expect(repeatPasswordInput.value).toBeDefined();
  }
};

const setNavigate = () => {};

it('Renders SignupForm successfully', async () => {
  const accessToken = '';
  const setAccessToken = () => {};
  const id = '';
  const setId = () => {};
  render(
    <LoginContext.Provider value={{ id, accessToken, setId, setAccessToken }}>
      <SignupForm navigate={setNavigate} />
    </LoginContext.Provider>
  );
  expect(screen.getByText('Create account', { exact: false })).toBeDefined();
  expect(screen.getByText('Your Name', { exact: false })).toBeDefined();
  expect(screen.getByText('Email', { exact: false })).toBeDefined();
  expect(screen.getAllByText('Password', { exact: false })).toBeDefined();
  expect(screen.getByText('Re-enter password', { exact: false })).toBeDefined();
});

it('Fills out signin form and clicks on request', async () => {
  render(<SignupForm navigate={setNavigate} />);
  await fillOutForm();
  fireEvent.click(screen.getByText('Request'));
});

it('Fills out signin form and errors on a request', async () => {
  render(<SignupForm navigate={setNavigate} />);
  await fillOutForm();
  returnError = true;
  fireEvent.click(screen.getByText('Request'));
});

it('Fills out signin form and catches server error', async () => {
  render(<SignupForm navigate={setNavigate} />);
  await fillOutForm();
  server.close();
  fireEvent.click(screen.getByText('Request'));
});
