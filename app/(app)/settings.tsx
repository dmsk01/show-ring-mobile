import * as Burnt from 'burnt';
import { useCallback } from 'react';
import { useTheme } from 'src/theme';
import { useAuthActions } from 'src/auth';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, Radio, RadioGroup, Stack, Typography } from 'src/components/mui';

import type { JSX } from 'react';
import type { ThemeMode } from 'src/theme';

// ----------------------------------------------------------------------

const MODE_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'Follow system' },
];

// ----------------------------------------------------------------------

/**
 * Settings tab — MVP.
 *
 * Intentionally minimal per mobile scope policy (see CLAUDE.md memories):
 * theme mode + sign out only. Language switcher is dropped — device locale
 * via `expo-localization` is authoritative. Font size / layout toggles are
 * web-template carry-overs with no mobile UX payoff; revisit in Stage 2+
 * only if there's concrete demand.
 *
 * Sign out lives here (rather than a dedicated Profile tab) because on a
 * 2-tab MVP shell a whole tab for one action is over-engineering.
 */
export default function SettingsScreen(): JSX.Element {
  const { theme, mode, setMode } = useTheme();
  const { signOut } = useAuthActions();

  const handleModeChange = useCallback(
    (next: string) => {
      setMode(next as ThemeMode);
    },
    [setMode]
  );

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      // Redirect happens automatically via `(app)/_layout.tsx` guard once
      // `authenticated` flips to false.
    } catch (error) {
      if (__DEV__) console.error('Sign-out failed:', error);
      const message = error instanceof Error ? error.message : 'Please try again.';
      Burnt.alert({ title: 'Sign out failed', message, preset: 'error' });
    }
  }, [signOut]);

  return (
    <ScrollView
      style={{ backgroundColor: theme.palette.background.default }}
      contentContainerStyle={styles.content}
    >
      <Stack spacing={3}>
        <View>
          <Typography variant="overline" color="inherit">
            Appearance
          </Typography>
          <Typography variant="body2" sx={styles.sectionHelp}>
            Choose how show-ring-mobile looks on this device.
          </Typography>
        </View>

        <RadioGroup value={mode} onChange={handleModeChange}>
          <Stack spacing={1}>
            {MODE_OPTIONS.map((option) => (
              <Stack key={option.value} direction="row" spacing={1} alignItems="center">
                <Radio value={option.value} checked={mode === option.value} />
                <Typography variant="body1">{option.label}</Typography>
              </Stack>
            ))}
          </Stack>
        </RadioGroup>

        <Divider />

        <View>
          <Typography variant="overline" color="inherit">
            Account
          </Typography>
        </View>

        <Button variant="outlined" color="error" fullWidth onPress={handleSignOut}>
          Sign out
        </Button>
      </Stack>
    </ScrollView>
  );
}

// ----------------------------------------------------------------------

const styles = StyleSheet.create({
  content: {
    padding: 24,
  },
  sectionHelp: {
    marginTop: 4,
    opacity: 0.7,
  },
});
