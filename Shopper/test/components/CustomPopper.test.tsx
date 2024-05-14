import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
  act,
} from '@testing-library/react';
import React from 'react';
import CustomPopper from '@/components/CustomPopper';
import { useAppContext } from '@/contexts/AppContext';

jest.mock('../../src/contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

const mockAppContext = {
  backDropOpen: false,
  setBackDropOpen: jest.fn(),
};

describe('CustomPopper', () => {
  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue(mockAppContext);
  });

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

    // Mock the backdrop open state to true
    mockAppContext.backDropOpen = true;
    (useAppContext as jest.Mock).mockReturnValue(mockAppContext);

    const backdrop = document.querySelector('.MuiBackdrop-root');
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    await waitFor(() => {
      expect(mockAppContext.setBackDropOpen).toHaveBeenCalledWith(false);
    });
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

    fireEvent.mouseEnter(screen.getByText('Button Content'));
    fireEvent.mouseLeave(screen.getByText('Button Content'));
    fireEvent.mouseEnter(screen.getByText('Button Content'));

    act(() => {
      jest.runAllTimers();
    });

    expect(await screen.findByText('Popper Content')).toBeInTheDocument();
    jest.useRealTimers();
  });
});
