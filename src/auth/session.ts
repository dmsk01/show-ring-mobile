/**
 * Session orchestration — the single place that mutates auth storage + state.
 *
 * Used by:
 * - `src/auth/actions/jwt.ts` (after sign-in / sign-up)
 * - `src/lib/axios.ts` (on refresh failure)
 * - `app/_layout.tsx` (on bootstrap)
 * - `src/auth/hooks/use-auth-actions.ts` (sign-out)
 *
 * Uses `jotai.getDefaultStore()` so callers outside React (axios interceptor)
 * can mutate state without holding a hook. Downstream components that read
 * `useAtomValue(userAtom)` observe the change because jotai's default store
 * is global.
 */

import { getDefaultStore } from 'jotai';
import { secureStorage, SECURE_KEYS, setCachedToken } from 'src/lib/secure-storage';

import { userAtom } from './store/auth-atoms';

import type { AuthUser, TokenPair } from './types';

// ----------------------------------------------------------------------

export async function storeSession(payload: TokenPair & { user: AuthUser }): Promise<void> {
  const { accessToken, refreshToken, user } = payload;

  await secureStorage.setItem(SECURE_KEYS.accessToken, accessToken);
  if (refreshToken) {
    await secureStorage.setItem(SECURE_KEYS.refreshToken, refreshToken);
  }

  setCachedToken(accessToken);
  getDefaultStore().set(userAtom, user);
}

// ----------------------------------------------------------------------

export async function storeTokens(tokens: TokenPair): Promise<void> {
  const { accessToken, refreshToken } = tokens;

  await secureStorage.setItem(SECURE_KEYS.accessToken, accessToken);
  if (refreshToken) {
    await secureStorage.setItem(SECURE_KEYS.refreshToken, refreshToken);
  }

  setCachedToken(accessToken);
}

// ----------------------------------------------------------------------

export async function clearSession(): Promise<void> {
  setCachedToken(null);
  getDefaultStore().set(userAtom, null);

  await Promise.all([
    secureStorage.removeItem(SECURE_KEYS.accessToken),
    secureStorage.removeItem(SECURE_KEYS.refreshToken),
  ]);
}
