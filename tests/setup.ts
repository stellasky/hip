import '@testing-library/jest-dom';
import { vi } from 'vitest';

const USE_REAL_AMPLIFY = process.env.USE_REAL_AMPLIFY === 'true';

// Mock Amplify Data client to avoid configuration warnings in tests (unless explicitly disabled)
if (!USE_REAL_AMPLIFY) {
	vi.mock('aws-amplify/data', () => {
		function makeCrud() {
			return {
				list: async () => ({ data: [] }),
				get: async (_args?: any) => ({ data: null }),
				create: async (input?: any) => ({ data: { id: 'mock-id', ...input } }),
				update: async (input?: any) => ({ data: { ...input } }),
				delete: async (_input?: any) => ({ data: { success: true } }),
			};
		}
		return {
			generateClient: () => ({
				models: {
					User: makeCrud(),
					Visit: makeCrud(),
					Comment: makeCrud(),
					Photo: makeCrud(),
				},
			}),
		};
	});

	// Mock Authenticator to simulate auth flow in tests
	vi.mock('@aws-amplify/ui-react', async () => {
		const React = await import('react');
			function Authenticator({ children }: { children: React.ReactNode }) {
				const [route, setRoute] = (React as any).useState('signUp');
			if (route !== 'authenticated') {
				return (
					(React as any).createElement('div', null,
						(React as any).createElement('p', null, 'Please sign in'),
						(React as any).createElement('button', { type: 'button', onClick: () => setRoute('signUp') }, 'Sign Up'),
						(React as any).createElement('button', { type: 'button', onClick: () => setRoute('verify') }, 'Verify'),
						(React as any).createElement('button', { type: 'button', onClick: () => setRoute('signIn') }, 'Sign In'),
						(React as any).createElement('button', { type: 'button', onClick: () => setRoute('authenticated') }, 'Complete'),
					)
				);
			}
			return (
				(React as any).createElement('div', null,
					(React as any).createElement('button', { type: 'button', onClick: () => setRoute('signIn') }, 'Sign Out'),
					children
				)
			);
		}
		return { Authenticator };
	});
}
