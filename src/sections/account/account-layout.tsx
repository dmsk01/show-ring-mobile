/**
 * AccountLayout — mobile tab navigation wrapper for account sub-pages.
 *
 * Divergence from web (uses DashboardContent + MUI Tabs with RouterLink):
 *  - Uses expo-router's `usePathname` + `useRouter` for active tab detection
 *    and navigation.
 *  - Tab bar is a horizontally scrollable row so all 5 tabs fit on small screens.
 *  - Route hrefs cast via `as any` — expo-router type file is regenerated on
 *    next `expo start` once the new account routes are discovered.
 */

import { useTheme } from 'src/theme';
import { Pressable } from 'react-native';
import { sp } from 'src/theme/core/spacing';
import { Iconify } from 'src/components/iconify';
import { ScrollView, StyleSheet } from 'react-native';
import { Stack, Typography } from 'src/components/mui';
import { useRouter, usePathname } from 'src/routes/hooks';

import type { JSX, ReactNode } from 'react';
import type { IconifyName } from 'src/components/iconify';

// Transparent sentinel for inactive tab border (avoids color-literal lint warning).
const COLOR_TRANSPARENT = 'transparent';

// ----------------------------------------------------------------------

const NAV_ITEMS: { label: string; icon: IconifyName; href: string }[] = [
  { label: 'General', icon: 'solar:user-id-bold', href: '/account' },
  { label: 'Billing', icon: 'solar:bill-list-bold', href: '/account/billing' },
  { label: 'Notifications', icon: 'solar:bell-bing-bold', href: '/account/notifications' },
  { label: 'Social links', icon: 'solar:share-bold', href: '/account/socials' },
  { label: 'Security', icon: 'ic:round-vpn-key', href: '/account/change-password' },
];

type Props = {
  children: ReactNode;
};

export function AccountLayout({ children }: Props): JSX.Element {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Stack sx={{ flex: 1 }}>
      {/* Scrollable top tab bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ backgroundColor: theme.palette.background.paper }}
        contentContainerStyle={styles.tabBar}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.endsWith(item.href) || pathname === item.href;

          return (
            <Pressable
              key={item.href}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onPress={() => router.push(item.href as any)}
              style={[
                styles.tab,
                isActive && styles.tabActive,
                isActive && { borderBottomColor: theme.palette.primary.main },
              ]}
            >
              <Iconify
                icon={item.icon}
                width={20}
                color={isActive ? theme.palette.primary.main : theme.palette.text.secondary}
              />
              <Typography
                variant="caption"
                sx={{
                  marginLeft: sp(0.75),
                  color: isActive ? 'primary.main' : 'text.secondary',
                  fontWeight: isActive ? '600' : '400',
                }}
              >
                {item.label}
              </Typography>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Screen content */}
      <ScrollView
        style={[styles.contentScroll, { backgroundColor: theme.palette.background.default }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </Stack>
  );
}

AccountLayout.displayName = 'AccountLayout';

const styles = StyleSheet.create({
  tabBar: {
    paddingHorizontal: sp(2),
    gap: sp(0.5),
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sp(1.5),
    paddingVertical: sp(1.5),
    borderBottomWidth: 2,
    borderBottomColor: COLOR_TRANSPARENT,
  },
  tabActive: {
    borderBottomWidth: 2,
  },
  contentScroll: {
    flex: 1,
  },
  content: {
    padding: sp(2),
    paddingBottom: sp(6),
  },
});
