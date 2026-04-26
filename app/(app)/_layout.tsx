import { useTheme } from 'src/theme';
import { useAuthContext } from 'src/auth';
import { Redirect, Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SplashScreen } from 'src/components/custom';

import type { JSX } from 'react';

/**
 * Authenticated route group + tab shell.
 *
 * Divergence from web (`AuthGuard` wrapper + `<DashboardLayout>` shell):
 * expo-router's route groups + `<Redirect>` are the idiomatic guard; the
 * tab bar replaces web's sidebar for the MVP tab set. A separate
 * `src/layouts/DashboardLayout.tsx` file is intentionally NOT created —
 * `app/(app)/_layout.tsx` IS the layout; extracting a wrapper only makes
 * sense once we have chrome beyond tabs (FAB, app-wide drawer, etc.).
 * Revisit in Stage 2+ if needed.
 *
 * Tab icons use `@expo/vector-icons/MaterialIcons` so we stay consistent
 * with the MUI-family iconography used on the web.
 */
export default function AppLayout(): JSX.Element {
  const { loading, authenticated } = useAuthContext();
  const { theme } = useTheme();

  if (loading) return <SplashScreen />;
  if (!authenticated) return <Redirect href="/sign-in" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.palette.primary.main,
        tabBarInactiveTintColor: theme.palette.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.palette.background.paper,
          borderTopColor: theme.palette.divider,
        },
        headerStyle: {
          backgroundColor: theme.palette.background.paper,
        },
        headerTintColor: theme.palette.text.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Overview',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
      {/* Account section — hidden from tab bar, navigated to from Settings */}
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          href: null, // hides from tab bar
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
