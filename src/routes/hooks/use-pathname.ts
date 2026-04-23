import { usePathname as useExpoPathname } from 'expo-router';

// ----------------------------------------------------------------------

/**
 * Returns the current route pathname (e.g. `/dashboard/user`).
 * API-compatible with `next/navigation` `usePathname`.
 */
export function usePathname(): string {
  return useExpoPathname();
}
