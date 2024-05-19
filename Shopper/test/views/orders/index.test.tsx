import React from 'react';
import { render } from '@testing-library/react';
import Index from '../../../src/pages/orders/index';

describe('Index', () => {
  it('should render OrderCard component', () => {
    const { getByText } = render(<Index />);
    expect(getByText(/ORDER PLACED/i)).toBeInTheDocument();
  });
});
