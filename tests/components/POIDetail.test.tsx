import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VisitedProvider } from '../../src/context/VisitedContext';
import { POIDetail } from '../../src/components/pois/POIDetail';

describe('POIDetail component', () => {
  it('shows POI details, visited toggle, comments, and photos', async () => {
    render(
      <VisitedProvider>
        <POIDetail poiId="abbey_road_studio" />
      </VisitedProvider>
    );
    expect(screen.getByRole('heading', { name: /Abbey Road Studios/i })).toBeInTheDocument();
    expect(screen.getByText(/Recording location for many Beatles albums/i)).toBeInTheDocument();

    // Visited toggle
    expect(screen.getByText(/Visited:/i)).toBeInTheDocument();

    // Comments UI: optimistic add and delete
    const comments = screen.getByRole('region', { name: /comments/i });
    const addInput = within(comments).getByRole('textbox', { name: /add comment/i });
    const postBtn = within(comments).getByRole('button', { name: /post comment/i });
    // Add a comment
  const user = userEvent.setup();
  await user.type(addInput, 'Nice place');
  await user.click(postBtn);
    expect(within(comments).getByText(/Nice place/i)).toBeInTheDocument();
    // Delete a comment
  await user.click(within(comments).getByRole('button', { name: /delete comment/i }));
    expect(within(comments).queryByText(/Nice place/i)).not.toBeInTheDocument();

    // Photos UI: upload a small file, ensure filename appears and can be deleted
    const photos = screen.getByRole('region', { name: /photos/i });
    const fileInput = within(photos).getByLabelText(/upload photo/i) as HTMLInputElement;
    const file = new File([new ArrayBuffer(1024)], 'test.png', { type: 'image/png' });
  await user.upload(fileInput, file);
    expect(within(photos).getByText(/test.png/i)).toBeInTheDocument();
  await user.click(within(photos).getByRole('button', { name: /delete test.png/i }));
    expect(within(photos).queryByText(/test.png/i)).not.toBeInTheDocument();
  });
});
