import { Stack } from 'expo-router';
import { useTheme } from 'src/theme';

import type { JSX } from 'react';

// ----------------------------------------------------------------------

export default function AccountStackLayout(): JSX.Element {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.palette.background.paper },
        headerTintColor: theme.palette.text.primary,
        headerTitle: 'Account',
        contentStyle: { backgroundColor: theme.palette.background.default },
      }}
    />
  );
}
