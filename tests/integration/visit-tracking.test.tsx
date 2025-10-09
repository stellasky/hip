import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

describe('Visit tracking flow', () => {
  it('marks POI as visited/unvisited and syncs across views', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Navigate to band
    await user.click(await screen.findByRole('button', { name: /the beatles/i }));

  // Initially, visited map has 0 markers
  const visitedMap = screen.getByRole('region', { name: /visited-pois/i });
  expect(within(visitedMap).getByText(/Markers:\s*0/i)).toBeInTheDocument();

    // Open a POI detail and mark visited
    await user.click(screen.getByRole('button', { name: /Abbey Road Studios/i }));
    expect(await screen.findByRole('heading', { name: /Abbey Road Studios/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Mark Visited/i }));

    // Go back to band page
    await user.click(screen.getByRole('button', { name: /Back to Band/i }));

    // Visited section now shows the POI and 1 marker
  const visitedMapAfter = screen.getByRole('region', { name: /visited-pois/i });
  expect(within(visitedMapAfter).getByText(/Markers:\s*1/i)).toBeInTheDocument();
  const visitedSection = screen.getByRole('region', { name: /Visited POIs/i });
  expect(within(visitedSection).getByRole('button', { name: /Abbey Road Studios/i })).toBeInTheDocument();

    // Open again and unmark visited
  await user.click(within(visitedSection).getByRole('button', { name: /Abbey Road Studios/i }));
    await user.click(await screen.findByRole('button', { name: /Mark Unvisited/i }));
    await user.click(screen.getByRole('button', { name: /Back to Band/i }));

    // Visited section back to 0
  const visitedMapFinal = screen.getByRole('region', { name: /visited-pois/i });
  expect(within(visitedMapFinal).getByText(/Markers:\s*0/i)).toBeInTheDocument();
  });
});
