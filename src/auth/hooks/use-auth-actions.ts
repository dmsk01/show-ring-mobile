/**
 * `useAuthActions` — thin memoised wrapper around the plain actions in
 * `src/auth/actions/jwt.ts`.
 *
 * Why a hook at all, if the actions are pure? Convenience for screens: one
 * import, memoised callbacks that hook-form handlers can depend on without
 * tripping the exhaustive-deps lint rule. The hook does NOT own state —
 * session mutations go through `src/auth/session.ts` as always.
 */

import { useCallback } from 'react';

import {
  signInWithPassword as signInAction,
  signOut as signOutAction,
  signUp as signUpAction,
} from '../actions/jwt';

import type { SessionPayload, SignInParams, SignUpParams } from '../types';

// ----------------------------------------------------------------------

export type UseAuthActionsReturn = {
  signIn: (params: SignInParams) => Promise<SessionPayload>;
  signUp: (params: SignUpParams) => Promise<SessionPayload>;
  signOut: () => Promise<void>;
};

export function useAuthActions(): UseAuthActionsReturn {
  const signIn = useCallback((params: SignInParams) => signInAction(params), []);
  const signUp = useCallback((params: SignUpParams) => signUpAction(params), []);
  const signOut = useCallback(() => signOutAction(), []);

  return { signIn, signUp, signOut };
}
