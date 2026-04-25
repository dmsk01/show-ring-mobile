/**
 * `PermissionDeniedView` — RN port of `src/sections/permission/view.tsx`.
 *
 * Uses `usePermissions()` from the RBAC system. Displays current role and
 * demonstrates permission-gated content via `<Can>`.
 *
 * Divergences from web:
 *  - `RoleBasedGuard` replaced by `<Can>` component from RBAC system.
 *  - `CustomBreadcrumbs` replaced with a plain heading.
 *  - Grid reflowed to 1 column for phone widths.
 */

import { useTheme } from 'src/theme';
import { Can } from 'src/components/can';
import { Iconify } from 'src/components/iconify';
import { usePermissions } from 'src/hooks/use-permissions';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardHeader, Stack, Typography } from 'src/components/mui';

import type { JSX } from 'react';

// ----------------------------------------------------------------------

// Any permission works here — this page demonstrates the RBAC system.
// `management:view` is gated to admin only in the default matrix.
const DEMO_PERMISSION = 'management:view' as const;

// ----------------------------------------------------------------------

export function PermissionDeniedView(): JSX.Element {
  const { theme } = useTheme();
  const { role } = usePermissions();

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.palette.background.default }]}
      edges={['top', 'bottom']}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Typography variant="h4">Permission</Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={styles.roleRow}>
          <Typography variant="subtitle2">Current role:</Typography>
          <Typography variant="body1">{role ?? 'unknown'}</Typography>
        </Stack>

        <Can
          permission={DEMO_PERMISSION}
          fallback={
            <View style={styles.denied}>
              <Iconify
                icon="solar:forbidden-circle-bold"
                width={96}
                color={theme.palette.error.main}
              />
              <Typography variant="h5" align="center" sx={styles.deniedTitle}>
                Permission denied
              </Typography>
              <Typography
                variant="body2"
                align="center"
                sx={{ color: theme.palette.text.secondary }}
              >
                You do not have permission to access this page.
              </Typography>
            </View>
          }
        >
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
        </Can>
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
