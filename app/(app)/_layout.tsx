import { useAuthContext } from 'src/auth';
import { Redirect, Stack } from 'expo-router';

import type { JSX } from 'react';

/**
 * Authenticated route group.
 *
 * Divergence from web (`AuthGuard` wrapper): expo-router's route groups +
 * `<Redirect>` are the idiomatic pattern. The folder structure IS the guard.
 *
 * While bootstrap is running (`loading === true`) we return `null` so nothing
 * flashes; Splash screen itself stays visible until the first paint. A proper
 * in-app Splash component is deferred to 1.7.
 */
export default function AppLayout(): JSX.Element | null {
  const { loading, authenticated } = useAuthContext();

  if (loading) return null;
  if (!authenticated) return <Redirect href="/login" />;

  return <Stack />;
}
