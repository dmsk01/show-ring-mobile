/**
 * `SplashScreen` — in-app loading placeholder.
 *
 * Rendered by route-group guards (`app/(app)/_layout.tsx`,
 * `app/(auth)/_layout.tsx`) while the auth bootstrap is still resolving
 * (`isHydratedAtom === false`). Native Expo Splash itself stays visible until
 * the first paint; this covers the brief window after `<Slot />` mounts but
 * before `useAuthContext()` reports a final answer.
 *
 * Kept intentionally minimal for MVP. A branded Splash with logo/animation is
 * tracked as plan §1.7; replace this component there.
 */

import { StyleSheet, View } from 'react-native';
import { CircularProgress } from 'src/components/mui';

import type { JSX } from 'react';

// ----------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ----------------------------------------------------------------------

export function SplashScreen(): JSX.Element {
  return (
    <View style={styles.root}>
      <CircularProgress />
    </View>
  );
}

SplashScreen.displayName = 'SplashScreen';
