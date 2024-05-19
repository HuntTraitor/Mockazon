import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderCard from '../../../src/pages/orders/ordercard';

describe('OrderCard', () => {
  it('should display order information', () => {
    render(<OrderCard />);

    expect(screen.getByText(/ORDER PLACED/i)).toBeInTheDocument();
    expect(screen.getByText(/TOTAL/i)).toBeInTheDocument();
    expect(screen.getByText(/SHIP TO/i)).toBeInTheDocument();
    expect(screen.getByText(/ORDER #/i)).toBeInTheDocument();
    expect(screen.getByText(/Delivered/i)).toBeInTheDocument();
    expect(screen.getByText(/Your package was left near the front door or porch/i)).toBeInTheDocument();
    expect(screen.getByAltText(/product-image/i)).toBeInTheDocument();
    expect(screen.getByText(/Computer science book for dumb people/i)).toBeInTheDocument();
    expect(screen.getByText(/Return or replace items/i)).toBeInTheDocument();
    expect(screen.getByText(/Buy it again/i)).toBeInTheDocument();
    expect(screen.getByText(/View your item/i)).toBeInTheDocument();
    expect(screen.getByText(/Track package/i)).toBeInTheDocument();
    expect(screen.getByText(/Return or replace items/i)).toBeInTheDocument();
    expect(screen.getByText(/Share gift recipt/i)).toBeInTheDocument();
    expect(screen.getByText(/Write a product review/i)).toBeInTheDocument();
    expect(screen.getByText(/Archive order/i)).toBeInTheDocument();
  });
});
