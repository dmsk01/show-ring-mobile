import { useTheme } from 'src/theme';
import { useAuthContext } from 'src/auth';
import { StyleSheet, View } from 'react-native';
import { Stack, Typography } from 'src/components/mui';

import type { JSX } from 'react';

/**
 * Overview tab — MVP welcome screen.
 *
 * Greets the authenticated user by display name (falls back to email).
 * Real dashboard widgets (recent activity, quick links, stats) are scoped
 * for later stages — §1.7 deliberately ships only a confirmation of the
 * end-to-end flow (sign-in → guard → authenticated tabs).
 */
export default function OverviewScreen(): JSX.Element {
  const { theme } = useTheme();
  const { user } = useAuthContext();

  const displayName =
    typeof user?.displayName === 'string' && user.displayName.length > 0
      ? user.displayName
      : (user?.email ?? 'there');

  return (
    <View style={[styles.root, { backgroundColor: theme.palette.background.default }]}>
      <Stack spacing={1} alignItems="center">
        <Typography variant="h4" color="primary">
          Welcome back
        </Typography>
        <Typography variant="subtitle1" align="center">
          {displayName}
        </Typography>
        <Typography variant="body2" color="inherit" align="center">
          You're signed in to show-ring-mobile.
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
