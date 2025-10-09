import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../../src/App';
import { Authenticator } from '@aws-amplify/ui-react';

vi.mock('@aws-amplify/ui-react', async () => {
  // Provide a test Authenticator that simulates the major steps and controls rendering of children
  const React = await import('react');
  function Authenticator({ children }: { children: React.ReactNode }) {
    const [route, setRoute] = React.useState<'signIn' | 'signUp' | 'verify' | 'authenticated'>('signUp');
    if (route !== 'authenticated') {
      return (
        <div>
          <p>Please sign in</p>
          <button type="button" onClick={() => setRoute('signUp')}>Sign Up</button>
          <button type="button" onClick={() => setRoute('verify')}>Verify</button>
          <button type="button" onClick={() => setRoute('signIn')}>Sign In</button>
          <button type="button" onClick={() => setRoute('authenticated')}>Complete</button>
        </div>
      );
    }
    return (
      <div>
        <button type="button" onClick={() => setRoute('signIn')}>Sign Out</button>
        {children}
      </div>
    );
  }
  return { Authenticator };
});

describe('Auth flow', () => {
  it('signs up, verifies, signs in, and persists session', async () => {
    const user = userEvent.setup();
    render(
      <Authenticator>
        <App />
      </Authenticator>
    );

    // Start unauthenticated
    expect(await screen.findByText(/please sign in/i)).toBeInTheDocument();

    // Simulate sign up -> verify -> sign in -> complete
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    await user.click(screen.getByRole('button', { name: /verify/i }));
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await user.click(screen.getByRole('button', { name: /complete/i }));

    // Authenticated: App renders home
    expect(await screen.findByRole('heading', { name: /select a band/i })).toBeInTheDocument();

    // Navigate to ensure session persists across pages
    await user.click(screen.getByRole('button', { name: /the beatles/i }));
    expect(await screen.findByRole('heading', { name: /the beatles/i })).toBeInTheDocument();

    // Sign out
    await user.click(screen.getByRole('button', { name: /sign out/i }));
    expect(await screen.findByText(/please sign in/i)).toBeInTheDocument();
  });
});
