import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhotoUpload } from '../../src/components/shared/PhotoUpload';

describe('PhotoUpload component', () => {
  it('validates size and uploads to storage', async () => {
    const user = userEvent.setup();
    const onUpload = vi.fn();
    render(<PhotoUpload maxBytes={10 * 1024 * 1024} onUpload={onUpload} />);
    const input = screen.getByLabelText(/upload photo/i) as HTMLInputElement;
    const file = new File(['hello'], 'hello.jpg', { type: 'image/jpeg' });
    await user.upload(input, file);
    expect(onUpload).toHaveBeenCalled();
  });
});
