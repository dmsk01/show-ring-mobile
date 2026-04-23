/**
 * MMKV-backed key/value storage wrapper (react-native-mmkv 4.x API).
 *
 * Usage: non-secret application state (theme mode, language override, UI
 * preferences, SWR cache snapshot). Tokens and credentials MUST go through
 * `src/lib/secure-storage.ts` instead.
 *
 * @see docs/plans/2026-04-22-react-native-port-plan.md §4.1.3
 */

import { createMMKV } from 'react-native-mmkv';

const mmkv = createMMKV({ id: 'app-storage' });

export const storage = {
  getItem(key: string): string | null {
    const value = mmkv.getString(key);
    return value === undefined ? null : value;
  },
  setItem(key: string, value: string): void {
    mmkv.set(key, value);
  },
  removeItem(key: string): void {
    mmkv.remove(key);
  },
  clear(): void {
    mmkv.clearAll();
  },
  getBoolean(key: string): boolean | null {
    const value = mmkv.getBoolean(key);
    return value === undefined ? null : value;
  },
  setBoolean(key: string, value: boolean): void {
    mmkv.set(key, value);
  },
  getNumber(key: string): number | null {
    const value = mmkv.getNumber(key);
    return value === undefined ? null : value;
  },
  setNumber(key: string, value: number): void {
    mmkv.set(key, value);
  },
  getJSON<T>(key: string): T | null {
    const raw = mmkv.getString(key);
    if (raw === undefined) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  setJSON<T>(key: string, value: T): void {
    mmkv.set(key, JSON.stringify(value));
  },
};

export type Storage = typeof storage;
