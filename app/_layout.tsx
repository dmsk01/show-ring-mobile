import 'react-native-gesture-handler';
import { Slot } from 'expo-router';
import { useSetAtom } from 'jotai';
import { StyleSheet } from 'react-native';
import { ThemeProvider } from 'src/theme';
import { StatusBar } from 'expo-status-bar';
import { useEffect, type JSX } from 'react';
import { I18nProvider, LocalizationProvider } from 'src/locales';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { clearSession, isHydratedAtom, isValidToken } from 'src/auth';
import { SECURE_KEYS, secureStorage, setCachedToken } from 'src/lib/secure-storage';

/**
 * Root layout — providers stack + auth bootstrap.
 *
 * Bootstrap sequence (see `CLAUDE.md` §"Auth — divergence from web"):
 * 1. `userAtom` is already hydrated synchronously from MMKV by `atomWithStorage`.
 * 2. Read access token from secure-storage; if valid, prime the sync cache.
 * 3. If token is missing or expired, `clearSession()` reconciles jotai + storage.
 * 4. Flip `isHydratedAtom` so guards stop showing Splash.
 *
 * Refresh on expiry is handled by the axios 401 interceptor at request time,
 * not here — no need to pre-refresh on cold start.
 */
export default function RootLayout(): JSX.Element {
  const setHydrated = useSetAtom(isHydratedAtom);

  useEffect(() => {
    async function bootstrapAuth(): Promise<void> {
      try {
        const token = await secureStorage.getItem(SECURE_KEYS.accessToken);
        if (token && isValidToken(token)) {
          setCachedToken(token);
        } else {
          await clearSession();
        }
      } finally {
        setHydrated(true);
      }
    }
    bootstrapAuth();
  }, [setHydrated]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.root}>
        <I18nProvider>
          <ThemeProvider>
            <LocalizationProvider>
              <StatusBar style="auto" />
              <Slot />
            </LocalizationProvider>
          </ThemeProvider>
        </I18nProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
