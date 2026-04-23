import { useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';

// ----------------------------------------------------------------------

/**
 * `URLSearchParams`-compatible read-only view over the current route
 * query string. Mirrors `next/navigation` `useSearchParams()`.
 */
export interface ReadonlySearchParams {
  get: (key: string) => string | null;
  getAll: (key: string) => string[];
  has: (key: string) => boolean;
  entries: () => IterableIterator<[string, string]>;
  keys: () => IterableIterator<string>;
  values: () => IterableIterator<string>;
  toString: () => string;
}

function toStrings(value: string | string[] | undefined): string[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

export function useSearchParams(): ReadonlySearchParams {
  const raw = useLocalSearchParams<Record<string, string | string[]>>();

  return useMemo<ReadonlySearchParams>(() => {
    const entries: Array<[string, string]> = [];
    for (const key of Object.keys(raw)) {
      for (const v of toStrings(raw[key])) {
        entries.push([key, v]);
      }
    }

    return {
      get: (key) => {
        const list = toStrings(raw[key]);
        return list.length > 0 ? list[0] : null;
      },
      getAll: (key) => toStrings(raw[key]),
      has: (key) => key in raw,
      entries: () => entries[Symbol.iterator](),
      keys: () => entries.map(([k]) => k)[Symbol.iterator](),
      values: () => entries.map(([, v]) => v)[Symbol.iterator](),
      toString: () =>
        entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&'),
    };
  }, [raw]);
}
