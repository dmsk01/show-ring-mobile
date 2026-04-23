/**
 * Secure key/value storage backed by Keychain (iOS) / Keystore (Android)
 * via `expo-secure-store`.
 *
 * Usage: tokens, credentials, anything that must not land on disk in
 * plain text. Non-secret preferences go through `src/lib/storage.ts`.
 *
 * All methods are async — expo-secure-store has no sync API.
 *
 * @see docs/plans/2026-04-22-react-native-port-plan.md §4.1.3
 */

import * as SecureStore from 'expo-secure-store';

// ----------------------------------------------------------------------

export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      if (__DEV__) console.warn(`[secureStorage] getItem("${key}") failed`, error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      if (__DEV__) console.warn(`[secureStorage] setItem("${key}") failed`, error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      if (__DEV__) console.warn(`[secureStorage] removeItem("${key}") failed`, error);
    }
  },
};

export type SecureStorage = typeof secureStorage;

// ----------------------------------------------------------------------

/**
 * In-process cache for values that must be read synchronously
 * (e.g. the access token read by an axios request interceptor).
 *
 * The auth provider writes through `setCachedToken` on sign-in /
 * refresh and clears it on sign-out. Consumers read via
 * `getCachedToken` without awaiting the Keychain round-trip.
 */
let cachedAccessToken: string | null = null;

export function getCachedToken(): string | null {
  return cachedAccessToken;
}

export function setCachedToken(token: string | null): void {
  cachedAccessToken = token;
}

// ----------------------------------------------------------------------

export const SECURE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
} as const;

export type SecureKey = (typeof SECURE_KEYS)[keyof typeof SECURE_KEYS];
