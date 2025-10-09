import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BandList } from '../../src/components/bands/BandList';

describe('BandList component', () => {
  it('renders bands and supports selection', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<BandList onSelect={onSelect} />);

    // Bands from sample data
    expect(await screen.findByText('The Beatles')).toBeInTheDocument();
    expect(screen.getByText('The Rolling Stones')).toBeInTheDocument();

    await user.click(screen.getByText('The Beatles'));
    expect(onSelect).toHaveBeenCalledWith('beatles');
  });
});
