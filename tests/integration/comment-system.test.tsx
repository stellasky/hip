import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

describe('Comment system', () => {
  it('adds, edits, deletes comments with optimistic UI and LWW conflict resolution', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Navigate to band and poi
    await user.click(await screen.findByRole('button', { name: /the beatles/i }));
    await user.click(await screen.findByRole('button', { name: /Abbey Road Studios/i }));

    // Comments section
    const commentsSection = screen.getByRole('region', { name: /comments/i });

    // Add a comment
    await user.type(within(commentsSection).getByRole('textbox', { name: /add comment/i }), 'Great studio');
    await user.click(within(commentsSection).getByRole('button', { name: /post comment/i }));
    expect(within(commentsSection).getByText(/Great studio/i)).toBeInTheDocument();

    // Edit the comment
    await user.click(within(commentsSection).getByRole('button', { name: /edit comment/i }));
    const editBox = within(commentsSection).getByRole('textbox', { name: /edit comment/i });
    await user.clear(editBox);
    await user.type(editBox, 'Legendary studio');
    await user.click(within(commentsSection).getByRole('button', { name: /save comment/i }));
    expect(within(commentsSection).getByText(/Legendary studio/i)).toBeInTheDocument();

    // Delete the comment
    await user.click(within(commentsSection).getByRole('button', { name: /delete comment/i }));
    expect(within(commentsSection).queryByText(/Legendary studio/i)).not.toBeInTheDocument();

    // LWW sanity: quick successive edits, last one persists
    await user.type(within(commentsSection).getByRole('textbox', { name: /add comment/i }), 'V1');
    await user.click(within(commentsSection).getByRole('button', { name: /post comment/i }));
    await user.click(within(commentsSection).getByRole('button', { name: /edit comment/i }));
    const editBox2 = within(commentsSection).getByRole('textbox', { name: /edit comment/i });
    await user.clear(editBox2);
    await user.type(editBox2, 'V2');
    await user.click(within(commentsSection).getByRole('button', { name: /save comment/i }));
    expect(within(commentsSection).getByText(/V2/i)).toBeInTheDocument();
  });
});
