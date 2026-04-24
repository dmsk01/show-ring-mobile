/**
 * `View403` — RN port of `src/sections/error/403-view.tsx`.
 * See `not-found-view.tsx` for the divergence rationale common to this block.
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

export function View403(): JSX.Element {
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
            No permission
          </Typography>
          <Typography variant="body1" align="center" sx={{ color: theme.palette.text.secondary }}>
            The page you’re trying to access has restricted access. Please refer to your system
            administrator.
          </Typography>
          <Iconify
            icon="solar:shield-keyhole-bold-duotone"
            width={ILLUSTRATION_SIZE}
            color={theme.palette.error.main}
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

View403.displayName = 'View403';

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
