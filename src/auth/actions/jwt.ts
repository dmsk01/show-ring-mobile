/**
 * JWT auth actions — plain async functions, mirror web's
 * `G:/Work/show-ring/src/auth/context/jwt/action.ts` signatures.
 *
 * No service objects (`authService.login(...)`) — see `CLAUDE.md`
 * §"Data fetching". Side-effects (secure-storage + jotai user atom) are
 * routed through `src/auth/session.ts`.
 */

import api, { endpoints } from 'src/lib/axios';

import { clearSession, storeSession } from '../session';

import type { AuthUser, SessionPayload, SignInParams, SignUpParams } from '../types';

// ----------------------------------------------------------------------

type SignInResponse = {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
};

export async function signInWithPassword(params: SignInParams): Promise<SessionPayload> {
  const { data } = await api.post<SignInResponse>(endpoints.auth.signIn, params);

  const { accessToken, refreshToken, user } = data;
  if (!accessToken) {
    throw new Error('Access token missing in sign-in response');
  }

  const payload: SessionPayload = { accessToken, refreshToken, user };
  await storeSession(payload);
  return payload;
}

// ----------------------------------------------------------------------

export async function signUp(params: SignUpParams): Promise<SessionPayload> {
  const { data } = await api.post<SignInResponse>(endpoints.auth.signUp, params);

  const { accessToken, refreshToken, user } = data;
  if (!accessToken) {
    throw new Error('Access token missing in sign-up response');
  }

  const payload: SessionPayload = { accessToken, refreshToken, user };
  await storeSession(payload);
  return payload;
}

// ----------------------------------------------------------------------

export async function signOut(): Promise<void> {
  await clearSession();
}

// ----------------------------------------------------------------------

export async function fetchCurrentUser(): Promise<AuthUser> {
  const { data } = await api.get<{ user: AuthUser }>(endpoints.auth.me);
  return data.user;
}
