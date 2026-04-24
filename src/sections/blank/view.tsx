/**
 * `BlankView` — RN port of `src/sections/blank/view.tsx`.
 *
 * Web parity: `title` + optional `description` + dashed placeholder box.
 * Divergences:
 *  - No `DashboardContent` wrapper — mobile has no shared dashboard shell;
 *    the calling screen handles its own SafeArea / scroll.
 *  - `varAlpha` background substituted with a direct color application of
 *    `palette.grey[500]` via the theme `alpha` helper (see `varAlpha` util on
 *    mobile). `sx`-style array flatten from web is unnecessary because the
 *    RN adapter takes a flat style object.
 */

import { useTheme, varAlpha } from 'src/theme';
import { Typography } from 'src/components/mui';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { JSX } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

export type BlankViewProps = {
  title?: string;
  description?: string;
  style?: StyleProp<ViewStyle>;
};

export function BlankView({ title = 'Blank', description, style }: BlankViewProps): JSX.Element {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.palette.background.default }]}
      edges={['top', 'bottom']}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Typography variant="h4">{title}</Typography>
        {description ? (
          <Typography variant="body1" sx={styles.description}>
            {description}
          </Typography>
        ) : null}
        <View
          style={[
            styles.placeholder,
            {
              borderColor: theme.palette.divider,
              backgroundColor: varAlpha(theme.palette.grey['500Channel'], 0.04),
            },
            style,
          ]}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

BlankView.displayName = 'BlankView';

// ----------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  description: {
    marginTop: 8,
  },
  placeholder: {
    marginTop: 40,
    height: 320,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
});
