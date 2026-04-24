import { useAuthContext } from 'src/auth';
import { Redirect, Stack } from 'expo-router';
import { SplashScreen } from 'src/components/custom';

import type { JSX } from 'react';

/**
 * Authenticated route group.
 *
 * Divergence from web (`AuthGuard` wrapper): expo-router's route groups +
 * `<Redirect>` are the idiomatic pattern. The folder structure IS the guard.
 *
 * While bootstrap is running (`loading === true`) we render the in-app
 * `SplashScreen` so there's no blank flash. A branded Splash with
 * logo/animation is tracked under plan §1.7.
 */
export default function AppLayout(): JSX.Element {
  const { loading, authenticated } = useAuthContext();

  if (loading) return <SplashScreen />;
  if (!authenticated) return <Redirect href="/sign-in" />;

  return <Stack />;
}
