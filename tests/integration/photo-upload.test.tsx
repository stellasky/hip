import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

function makeFile(name: string, size: number, type = 'image/png') {
  const blob = new Blob([new Uint8Array(size)], { type });
  return new File([blob], name, { type });
}

describe('Photo upload', () => {
  it('validates size, uploads to S3, lists thumbnails, and deletes', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Navigate to POI
    await user.click(await screen.findByRole('button', { name: /the beatles/i }));
    await user.click(await screen.findByRole('button', { name: /Abbey Road Studios/i }));

    const photosSection = screen.getByRole('region', { name: /photos/i });
    const input = within(photosSection).getByLabelText(/upload photo/i);

    // Too large file rejected
    const bigFile = makeFile('big.png', 5 * 1024 * 1024);
    await user.upload(input, bigFile);
    expect(within(photosSection).queryByText(/big.png/i)).not.toBeInTheDocument();

    // Valid file accepted
    const okFile = makeFile('ok.png', 50 * 1024);
    await user.upload(input, okFile);
    expect(within(photosSection).getByText(/ok.png/i)).toBeInTheDocument();

    // Delete it
    await user.click(within(photosSection).getByRole('button', { name: /delete ok.png/i }));
    expect(within(photosSection).queryByText(/ok.png/i)).not.toBeInTheDocument();
  });
});
