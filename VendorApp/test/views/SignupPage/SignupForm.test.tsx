import { fireEvent, render, screen} from '@testing-library/react'
import { SignupForm } from '@/views/Signup/SignupForm';
import userEvent from '@testing-library/user-event'

it('Renders SignupForm successfully', async() => {
  render(<SignupForm />)
  expect(screen.getByText('Create account', {exact: false})).toBeDefined();
  expect(screen.getByText('Your Name', {exact: false})).toBeDefined();
  expect(screen.getByText('Email', {exact: false})).toBeDefined();
  expect(screen.getAllByText('Password', {exact: false})).toBeDefined();
  expect(screen.getByText('Re-enter password', {exact: false})).toBeDefined();
})

it('Fills out form and clicks on request', async() => {
  render(<SignupForm />)
  const nameInput = screen.getByLabelText('name-input')?.querySelector('input')
  if (nameInput) {
    await userEvent.type(nameInput, "Test Name")
    expect(nameInput.value).toBeDefined()
  }
  const emailInput = screen.getByLabelText('email-input')?.querySelector('input')
  if (emailInput) {
    await userEvent.type(emailInput, "Test@gmail.com")
    expect(emailInput.value).toBeDefined()
  }
  const passwordInput = screen.getByLabelText('password-input')?.querySelector('input')
  if (passwordInput) {
    await userEvent.type(passwordInput, "password1234")
    expect(passwordInput.value).toBeDefined()
  }
  const repeatPasswordInput = screen.getByLabelText('repeatpassword-input')?.querySelector('input')
  if (repeatPasswordInput) {
    await userEvent.type(repeatPasswordInput, "password1234")
    expect(repeatPasswordInput.value).toBeDefined()
  }

  fireEvent.click(screen.getByText('Request'))
})