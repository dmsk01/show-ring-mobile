import { useEffect } from 'react';
import { useSWRConfig, type SWRConfiguration } from 'swr';
import { AppState, type AppStateStatus } from 'react-native';

import { fetcher } from './axios';

// ----------------------------------------------------------------------

/**
 * SWR defaults for mobile.
 *
 * Focus-based revalidation is driven by `AppState` (RN) instead of
 * `window.focus` (web). See `useAppStateRevalidation` below, which must
 * be mounted once near the provider tree.
 */
export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  shouldRetryOnError: true,
  errorRetryCount: 3,
};

// ----------------------------------------------------------------------

/**
 * Revalidates all SWR keys whenever the app returns to the foreground.
 *
 * Usage: mount once inside a component wrapped by `<SWRConfig>`.
 */
export function useAppStateRevalidation(): void {
  const { mutate } = useSWRConfig();

  useEffect(() => {
    let previous: AppStateStatus = AppState.currentState;

    const subscription = AppState.addEventListener('change', (next) => {
      if (previous.match(/inactive|background/) && next === 'active') {
        // revalidate every key
        mutate(() => true);
      }
      previous = next;
    });

    return () => subscription.remove();
  }, [mutate]);
}
