import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MapView } from '../../src/components/pois/MapView';
import type { POI } from '../../src/types/poi';

describe('MapView component', () => {
  it('renders map and clusters POI markers', () => {
    const sample: POI[] = [
      { id: 'a', name: 'A', address: 'addr', coordinates: { latitude: 0, longitude: 0 }, description: 'd', significance: 's', bandIds: ['beatles'], category: 'landmark' },
      { id: 'b', name: 'B', address: 'addr', coordinates: { latitude: 1, longitude: 1 }, description: 'd', significance: 's', bandIds: ['beatles'], category: 'venue' },
    ];
    render(<MapView pois={sample} />);
    expect(screen.getByRole('region', { name: /map/i })).toBeInTheDocument();
    expect(screen.getByText(/Markers:\s*2/i)).toBeInTheDocument();
  });
});
