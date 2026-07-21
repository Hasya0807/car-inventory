import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterRail } from '../components/vehicles/FilterRail';

describe('FilterRail', () => {
  it('calls onFilterChange with the right shape', () => {
    const handleFilterChange = vi.fn();
    render(<FilterRail filters={{}} onFilterChange={handleFilterChange} onClear={() => {}} />);
    
    const makeInput = screen.getByPlaceholderText(/e\.g\. Honda/i);
    fireEvent.change(makeInput, { target: { value: 'Toyota' } });
    
    expect(handleFilterChange).toHaveBeenCalledWith('make', 'Toyota');
  });

  it('calls onClear when clear button is clicked', () => {
    const handleClear = vi.fn();
    render(<FilterRail filters={{ make: 'Honda' }} onFilterChange={() => {}} onClear={handleClear} />);
    
    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    fireEvent.click(clearButton);
    
    expect(handleClear).toHaveBeenCalled();
  });
});
