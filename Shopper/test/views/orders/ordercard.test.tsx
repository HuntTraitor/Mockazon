import React from 'react';
import { render } from '@testing-library/react';
import OrderCard from '../../../src/pages/orders/ordercard';

describe('OrderCard', () => {
  it('should display order information', () => {
    render(<OrderCard />);
  });
});
