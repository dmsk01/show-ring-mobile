/**
 * Auth types — public shape that downstream code depends on.
 * Mirrors `G:/Work/show-ring/src/auth/types.ts` so ported sections see
 * the same `useAuthContext()` return value.
 */

export interface AuthUser {
  id: string | number;
  email: string;
  displayName?: string;
  photoURL?: string;
  role?: string;
  // Backend may include additional fields; keep the type open-ended.
  [key: string]: unknown;
}

export type UserType = AuthUser | null;

export type AuthState = {
  user: UserType;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
};

// ----------------------------------------------------------------------

export type SignInParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type TokenPair = {
  accessToken: string;
  refreshToken?: string;
};

export type SessionPayload = TokenPair & {
  user: AuthUser;
};
