/**
 * `MaintenanceView` — RN port of `src/sections/maintenance/view.tsx`.
 *
 * Web parity: same copy, same CTA. Same illustration → Iconify glyph
 * substitution as the error views (see `error/not-found-view.tsx`).
 */

import { useTheme } from 'src/theme';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Iconify } from 'src/components/iconify';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Stack, Typography } from 'src/components/mui';

import type { JSX } from 'react';

// ----------------------------------------------------------------------

const ILLUSTRATION_SIZE = 160;

export function MaintenanceView(): JSX.Element {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.palette.background.default }]}
      edges={['top', 'bottom']}
    >
      <View style={styles.content}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h3" align="center">
            Website currently under maintenance
          </Typography>
          <Typography variant="body1" align="center" sx={{ color: theme.palette.text.secondary }}>
            We are currently working hard on this page!
          </Typography>
          <Iconify
            icon="solar:settings-bold-duotone"
            width={ILLUSTRATION_SIZE}
            color={theme.palette.info.main}
            style={styles.illustration}
          />
          <Button variant="contained" size="large" onPress={() => router.replace('/')}>
            Go to home
          </Button>
        </Stack>
      </View>
    </SafeAreaView>
  );
}

MaintenanceView.displayName = 'MaintenanceView';

// ----------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  illustration: {
    marginVertical: 24,
  },
});
