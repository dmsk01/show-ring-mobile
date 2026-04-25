/**
 * `PermissionGuard` — permission-based route guard for expo-router.
 *
 * Pattern follows the existing auth guard in `app/(app)/_layout.tsx`:
 * render children when allowed, `<Redirect>` to 403 when denied,
 * splash while loading.
 */

import { Redirect } from 'expo-router';
import { useAuthContext } from 'src/auth/hooks';
import { SplashScreen } from 'src/components/custom';
import { usePermissions } from 'src/hooks/use-permissions';

import type { ReactNode } from 'react';
import type { Permission } from 'src/types/permissions';

// ----------------------------------------------------------------------

type PermissionGuardProps = {
  permission: Permission | Permission[];
  mode?: 'any' | 'all';
  children: ReactNode;
};

export function PermissionGuard({
  permission,
  mode = 'any',
  children,
}: PermissionGuardProps): ReactNode {
  const { loading } = useAuthContext();
  const { can, canAny, canAll } = usePermissions();

  if (loading) return <SplashScreen />;

  const perms = Array.isArray(permission) ? permission : [permission];
  const allowed =
    perms.length === 1 ? can(perms[0]) : mode === 'all' ? canAll(perms) : canAny(perms);

  if (!allowed) return <Redirect href="/error/403" />;

  return children;
}

PermissionGuard.displayName = 'PermissionGuard';
