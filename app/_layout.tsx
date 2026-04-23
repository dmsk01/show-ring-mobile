import 'react-native-gesture-handler';
import { Slot } from 'expo-router';
import { StyleSheet } from 'react-native';
import { ThemeProvider } from 'src/theme';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import type { JSX } from 'react';

/**
 * Root layout — providers stack.
 *
 * The full provider tree (LocalizationProvider, SettingsProvider, AuthProvider,
 * SWRConfig) is introduced in stages 1.3–1.6 of the plan. Stage 1.2 adds
 * ThemeProvider, which also mounts PaperProvider internally.
 *
 * See docs/plans/2026-04-22-react-native-port-plan.md §4.1.6.
 */
export default function RootLayout(): JSX.Element {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.root}>
        <ThemeProvider>
          <StatusBar style="auto" />
          <Slot />
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
