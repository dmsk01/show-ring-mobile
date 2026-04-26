import { useAuthContext } from './use-auth-context';

import type { AuthUser } from '../types';

// ----------------------------------------------------------------------

const MOCK_USER: AuthUser = {
  id: 'mock-user-1',
  email: 'demo@showring.io',
  displayName: 'Demo User',
  photoURL: '',
  phoneNumber: '+1-555-0100',
  country: 'United States',
  address: '908 Jack Locks',
  state: 'Virginia',
  city: 'Rancho Cordova',
  zipCode: '85807',
  about: 'Minimal UI Kit',
  isPublic: false,
  role: 'admin',
};

/**
 * Returns the authenticated user, falling back to a static mock when no real
 * session is active (e.g. in Storybook / prototype builds).
 */
export function useMockedUser(): { user: AuthUser } {
  const { user } = useAuthContext();
  return { user: user ?? MOCK_USER };
}
