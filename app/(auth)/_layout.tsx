import { useAuthContext } from 'src/auth';
import { Redirect, Stack } from 'expo-router';
import { SplashScreen } from 'src/components/custom';

import type { JSX } from 'react';

/**
 * Guest route group (reverse guard).
 *
 * Already-authenticated users bounce back to `/` — prevents showing the
 * sign-in screen behind stale navigation after a cold-start. Mirrors web's
 * `GuestGuard` wrapper via expo-router folder structure (see plan §4.1.5).
 *
 * During bootstrap (`loading === true`) we render the Splash placeholder so
 * there's no flash of the sign-in form for users whose token is still being
 * validated.
 */
export default function AuthLayout(): JSX.Element {
  const { loading, authenticated } = useAuthContext();

  if (loading) return <SplashScreen />;
  if (authenticated) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
