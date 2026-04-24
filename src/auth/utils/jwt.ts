/**
 * JWT helpers — RN port of `G:/Work/show-ring/src/auth/context/jwt/utils.ts`.
 *
 * Divergences:
 * - No `setSession` helper: axios interceptor + `src/auth/session.ts` own that flow.
 * - No `tokenExpired` setTimeout-alert: the 401 response interceptor in
 *   `src/lib/axios.ts` handles expiry by triggering refresh, then `clearSession`
 *   if the refresh fails. A foreground timer-alert is a web metaphor.
 * - `atob` is available globally in RN ≥ 0.74 (SDK 55 = RN 0.83) — no polyfill.
 */

// ----------------------------------------------------------------------

export type DecodedJwt = {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
};

export function jwtDecode(token: string): DecodedJwt | null {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid token');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.slice((base64.length + 3) % 4);
    const decoded = JSON.parse(atob(padded));

    return decoded as DecodedJwt;
  } catch (error) {
    if (__DEV__) console.error('[jwt] decode failed:', error);
    return null;
  }
}

// ----------------------------------------------------------------------

export function isValidToken(accessToken: string | null | undefined): boolean {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);
  if (!decoded || typeof decoded.exp !== 'number') {
    return false;
  }

  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
}
