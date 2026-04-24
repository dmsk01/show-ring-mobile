import { useTheme } from 'src/theme';
import { StyleSheet, View } from 'react-native';
import { Stack, Typography } from 'src/components/mui';

import type { JSX } from 'react';

/**
 * Settings tab — MVP placeholder.
 *
 * TODO(stage-1.7): wire theme mode toggle, language switch, and logout
 * action (via `useAuthActions().signOut`).
 */
export default function SettingsScreen(): JSX.Element {
  const { theme } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.palette.background.default }]}>
      <Stack spacing={1} alignItems="center">
        <Typography variant="h4" color="primary">
          Settings
        </Typography>
        <Typography variant="body2" color="inherit" align="center">
          Theme, language and logout land here in §1.7
        </Typography>
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
