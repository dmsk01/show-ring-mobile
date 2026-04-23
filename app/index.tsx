import { useTheme } from 'src/theme';
import { StyleSheet, View } from 'react-native';
import { Button, Divider, Stack, Typography } from 'src/components/mui';

import type { JSX } from 'react';

/**
 * Placeholder landing screen — smoke check for Stage 1.2 theme + adapters.
 * Replaced in stage 1.7 by the Overview dashboard inside `(dashboard)/index.tsx`
 * once auth guards and tab navigation are wired.
 */
export default function IndexScreen(): JSX.Element {
  const { theme, resolvedMode, toggleMode } = useTheme();

  return (
    <View
      style={[
        staticStyles.root,
        {
          padding: theme.spacing(3),
          backgroundColor: theme.palette.background.default,
        },
      ]}
    >
      <Stack spacing={2} alignItems="center">
        <Typography variant="h3" color="primary">
          show-ring-mobile
        </Typography>
        <Divider sx={{ width: 160 }} />
        <Typography variant="body2" color="inherit" align="center">
          Theme online ({resolvedMode}). Stage 1.2 in progress — see PROGRESS.md.
        </Typography>
        <Button variant="contained" color="primary" onClick={toggleMode}>
          Toggle theme
        </Button>
      </Stack>
    </View>
  );
}

const staticStyles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
