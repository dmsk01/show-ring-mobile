/**
 * `PermissionDeniedView` — RN port of `src/sections/permission/view.tsx`.
 *
 * Web parity: role toggle + role-gated grid of Cards + fallback message.
 * Divergences:
 *  - `ToggleButtonGroup` has no mobile adapter (not ported in Stage 1). Two
 *    `Button`s with `contained` / `outlined` states driven by the selected
 *    role give the same exclusive-toggle UX and route through adapters we
 *    already have. Cheap enough that introducing a full ToggleButtonGroup
 *    adapter stays YAGNI until a second consumer appears.
 *  - `RoleBasedGuard` inlined — it's a 3-line conditional and the component
 *    doesn't exist on mobile (auth `src/auth/guard/*` was MVP-trimmed).
 *  - `CustomBreadcrumbs` replaced with a plain heading + subtitle — mobile
 *    screens don't carry breadcrumb trails.
 *  - Grid reflowed from 2 columns → 1 column for phone widths (>= 600 px
 *    widths re-introduce 2 via `useResponsive` — YAGNI for the MVP demo).
 */

import { useTheme } from 'src/theme';
import { useState, useCallback } from 'react';
import { Iconify } from 'src/components/iconify';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, CardHeader, Stack, Typography } from 'src/components/mui';

import type { JSX } from 'react';

// ----------------------------------------------------------------------

type Role = 'admin' | 'user';

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
];

const ALLOWED_ROLES: Role[] = ['admin'];

// ----------------------------------------------------------------------

export function PermissionDeniedView(): JSX.Element {
  const { theme } = useTheme();
  const [role, setRole] = useState<Role>('admin');

  const handleChangeRole = useCallback((next: Role) => {
    setRole(next);
  }, []);

  const allowed = ALLOWED_ROLES.includes(role);

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.palette.background.default }]}
      edges={['top', 'bottom']}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Typography variant="h4">Permission</Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={styles.roleRow}>
          <Typography variant="subtitle2">My role:</Typography>
          {ROLE_OPTIONS.map((option) => (
            <Button
              key={option.value}
              size="small"
              variant={role === option.value ? 'contained' : 'outlined'}
              onPress={() => handleChangeRole(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </Stack>

        {allowed ? (
          <Stack spacing={2}>
            {Array.from({ length: 8 }, (_, index) => (
              <Card key={index}>
                <CardHeader title={`Card ${index + 1}`} subheader="Proin viverra ligula" />
                <Typography variant="body2" sx={styles.cardBody}>
                  Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. In enim justo,
                  rhoncus ut, imperdiet a, venenatis vitae, justo. Vestibulum fringilla pede sit
                  amet augue.
                </Typography>
              </Card>
            ))}
          </Stack>
        ) : (
          <View style={styles.denied}>
            <Iconify
              icon="solar:forbidden-circle-bold"
              width={96}
              color={theme.palette.error.main}
            />
            <Typography variant="h5" align="center" sx={styles.deniedTitle}>
              Permission denied
            </Typography>
            <Typography variant="body2" align="center" sx={{ color: theme.palette.text.secondary }}>
              You do not have permission to access this page.
            </Typography>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

PermissionDeniedView.displayName = 'PermissionDeniedView';

// ----------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  roleRow: {
    marginVertical: 24,
    justifyContent: 'center',
  },
  cardBody: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  denied: {
    marginTop: 48,
    alignItems: 'center',
  },
  deniedTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
});
