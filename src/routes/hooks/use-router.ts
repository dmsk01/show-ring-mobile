import { useMemo } from 'react';
import { useRouter as useExpoRouter } from 'expo-router';

// ----------------------------------------------------------------------

export type NavOptions = { scroll?: boolean };

export type Href = Parameters<ReturnType<typeof useExpoRouter>['push']>[0];

export interface AppRouter {
  push: (href: Href, options?: NavOptions) => void;
  replace: (href: Href, options?: NavOptions) => void;
  back: () => void;
  forward: () => void;
  refresh: () => void;
  prefetch: (href: Href) => void;
}

/**
 * Navigation hook with a Next.js-compatible surface, backed by
 * `expo-router`. Exists so that section code ported from the web
 * project can keep `const router = useRouter(); router.push(path)`
 * untouched.
 *
 * `options.scroll` is accepted for API parity and ignored —
 * native screens reset scroll on mount by default.
 */
export function useRouter(): AppRouter {
  const expo = useExpoRouter();

  return useMemo<AppRouter>(
    () => ({
      push: (href) => expo.push(href),
      replace: (href) => expo.replace(href),
      back: () => expo.back(),
      forward: () => {
        // expo-router does not expose forward navigation; no-op for parity.
      },
      refresh: () => {
        // Re-navigate to the current route as the closest refresh analogue.
        // Screens typically re-fetch through SWR/useEffect on focus instead.
      },
      prefetch: (href) => {
        if (typeof expo.prefetch === 'function') {
          expo.prefetch(href);
        }
      },
    }),
    [expo]
  );
}
