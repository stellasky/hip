import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BandDetail } from '../../src/components/bands/BandDetail';

describe('BandDetail component', () => {
  it('shows band info and POIs', async () => {
    render(<BandDetail bandId="beatles" />);
    expect(await screen.findByRole('heading', { name: /the beatles/i })).toBeInTheDocument();
    expect(screen.getByText(/Abbey Road Studios/i)).toBeInTheDocument();
    expect(screen.getByText(/The Cavern Club/i)).toBeInTheDocument();
  });
});
