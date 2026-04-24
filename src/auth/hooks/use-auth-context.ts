/**
 * `useAuthContext` — same public shape as web (`{ user, authenticated,
 * unauthenticated, loading }`) but backed by jotai atoms.
 *
 * Section code that does `const { authenticated } = useAuthContext()` works
 * identically after porting.
 */

import { useAtomValue } from 'jotai';

import { isHydratedAtom, userAtom } from '../store/auth-atoms';

import type { AuthContextValue } from '../types';

// ----------------------------------------------------------------------

export function useAuthContext(): AuthContextValue {
  const user = useAtomValue(userAtom);
  const hydrated = useAtomValue(isHydratedAtom);

  return {
    user,
    loading: !hydrated,
    authenticated: hydrated && user !== null,
    unauthenticated: hydrated && user === null,
  };
}
