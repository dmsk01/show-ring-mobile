/**
 * `View500` — RN port of `src/sections/error/500-view.tsx`.
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

export function View500(): JSX.Element {
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
            500 Internal server error
          </Typography>
          <Typography variant="body1" align="center" sx={{ color: theme.palette.text.secondary }}>
            There was an error, please try again later.
          </Typography>
          <Iconify
            icon="solar:close-circle-bold"
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

View500.displayName = 'View500';

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
