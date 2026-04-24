/**
 * `NotFoundView` — RN port of `src/sections/error/not-found-view.tsx`.
 *
 * Web parity: same copy and CTA target. Divergences:
 *  - `framer-motion` bounce entry dropped (no animation library wired on mobile
 *    yet; if motion returns in a later stage it lands via Reanimated, not
 *    framer-motion which is web-only).
 *  - `<PageNotFoundIllustration />` (complex SVG asset) substituted with a
 *    single Iconify glyph. Same visual role (hero illustration), zero new
 *    asset pipeline. See plan §6 Block A divergence note.
 *  - Host layout is a plain centered `View` rather than `SimpleLayout` —
 *    mobile has no concept of "simple" vs "dashboard" shell; the route file
 *    owns layout decisions.
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

export function NotFoundView(): JSX.Element {
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
            Sorry, page not found!
          </Typography>
          <Typography variant="body1" align="center" sx={{ color: theme.palette.text.secondary }}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be
            sure to check your spelling.
          </Typography>
          <Iconify
            icon="solar:danger-triangle-bold"
            width={ILLUSTRATION_SIZE}
            color={theme.palette.warning.main}
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

NotFoundView.displayName = 'NotFoundView';

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
