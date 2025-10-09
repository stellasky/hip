import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

describe('Band discovery flow', () => {
  it('selects band, shows POIs on list and map, and navigates to details', async () => {
    const user = userEvent.setup();
    render(<App />);

    // On home, select a band
    const beatlesBtn = await screen.findByRole('button', { name: /the beatles/i });
    await user.click(beatlesBtn);

    // Band detail page shows POIs and map
    expect(await screen.findByRole('heading', { name: /the beatles/i })).toBeInTheDocument();
    expect(screen.getByText(/Abbey Road Studios/i)).toBeInTheDocument();
    expect(screen.getByText(/The Cavern Club/i)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /map/i })).toBeInTheDocument();
    expect(screen.getByText(/Markers:\s*2/i)).toBeInTheDocument();

    // Navigate to a POI detail by clicking it
    await user.click(screen.getByRole('button', { name: /Abbey Road Studios/i }));
    expect(await screen.findByRole('heading', { name: /Abbey Road Studios/i })).toBeInTheDocument();
  });
});
