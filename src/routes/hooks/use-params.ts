import { useLocalSearchParams } from 'expo-router';

// ----------------------------------------------------------------------

/**
 * Returns the dynamic route parameters for the current screen.
 * API-compatible with `next/navigation` `useParams()`.
 */
export function useParams<
  T extends Record<string, string | string[]> = Record<string, string | string[]>,
>(): T {
  return useLocalSearchParams<T>() as T;
}
