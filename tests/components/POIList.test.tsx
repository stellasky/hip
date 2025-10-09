import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { POIList } from '../../src/components/pois/POIList';

describe('POIList component', () => {
  it('renders POIs for selected band and filters by visited', () => {
    const { rerender } = render(<POIList bandId="beatles" />);
    expect(screen.getByText('Abbey Road Studios')).toBeInTheDocument();
    expect(screen.getByText('The Cavern Club')).toBeInTheDocument();

    // Only visited 'cavern_club'
    rerender(<POIList bandId="beatles" showVisitedOnly visitedIds={["cavern_club"]} />);
    expect(screen.queryByText('Abbey Road Studios')).not.toBeInTheDocument();
    expect(screen.getByText('The Cavern Club')).toBeInTheDocument();
  });
});
