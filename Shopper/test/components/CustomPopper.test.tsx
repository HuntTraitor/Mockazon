import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
  act,
} from '@testing-library/react';
import React from 'react';
import CustomPopper from '@/components/CustomPopper';

it('Renders successfully', async () => {
  render(
    <CustomPopper buttonContent={<div>Button Content</div>}>
      <div>Popper Content</div>
    </CustomPopper>
  );
  expect(screen.getByText('Button Content')).toBeInTheDocument();
});

it('Opens popper on mouse enter', async () => {
  render(
    <CustomPopper buttonContent={<div>Button Content</div>}>
      <div>Popper Content</div>
    </CustomPopper>
  );
  fireEvent.mouseEnter(screen.getByText('Button Content'));
  expect(await screen.findByText('Popper Content')).toBeInTheDocument();
});

it('Closes popper on mouse leave', async () => {
  render(
    <CustomPopper buttonContent={<div>Button Content</div>}>
      <div>Popper Content</div>
    </CustomPopper>
  );
  fireEvent.mouseEnter(screen.getByText('Button Content'));
  expect(await screen.findByText('Popper Content')).toBeInTheDocument();
  fireEvent.mouseLeave(screen.getByText('Button Content'));
  await waitForElementToBeRemoved(() => screen.queryByText('Popper Content'));
});

it('Closes popper on backdrop click', async () => {
  render(
    <CustomPopper buttonContent={<div>Button Content</div>}>
      <div>Popper Content</div>
    </CustomPopper>
  );
  fireEvent.mouseEnter(screen.getByText('Button Content'));
  expect(await screen.findByText('Popper Content')).toBeInTheDocument();
  const backdrop = document.querySelector('.MuiBackdrop-root');

  if (backdrop) {
    fireEvent.click(backdrop);
  }
  expect(screen.queryByText('Popper Content')).not.toBeInTheDocument();
});

it('Clears timeout on unmount', async () => {
  const { unmount } = render(
    <CustomPopper buttonContent={<div>Button Content</div>}>
      <div>Popper Content</div>
    </CustomPopper>
  );
  fireEvent.mouseEnter(screen.getByText('Button Content'));
  expect(await screen.findByText('Popper Content')).toBeInTheDocument();
  unmount();
  // Simulate the passing of time for the timeout to potentially run
  jest.advanceTimersByTime(200);
  expect(screen.queryByText('Popper Content')).toBeNull();
});

it('Handles mouse enter correctly when timeout is set', async () => {
  jest.useFakeTimers();
  render(
    <CustomPopper buttonContent={<div>Button Content</div>}>
      <div>Popper Content</div>
    </CustomPopper>
  );

  // Trigger mouse leave to set the timeout
  fireEvent.mouseEnter(screen.getByText('Button Content'));
  fireEvent.mouseLeave(screen.getByText('Button Content'));

  // Trigger mouse enter again to clear the timeout
  fireEvent.mouseEnter(screen.getByText('Button Content'));

  // Fast forward the timers
  act(() => {
    jest.runAllTimers();
  });

  // Check if the popper is still open
  expect(await screen.findByText('Popper Content')).toBeInTheDocument();
  jest.useRealTimers();
});
