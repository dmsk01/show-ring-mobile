/**
 * `useAuthContext` — same public shape as web (`{ user, authenticated,
 * unauthenticated, loading, permissions }`) but backed by jotai atoms.
 *
 * Permissions are computed from `user.role` via the client-side matrix.
 * When the backend starts sending `user.permissions`, the fallback
 * (`getPermissionsForRole`) will be replaced.
 */

import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { getPermissionsForRole, normalizeRole } from 'src/utils/permissions';

import { isHydratedAtom, userAtom } from '../store/auth-atoms';

import type { AuthContextValue } from '../types';
import type { Permission } from 'src/types/permissions';

// ----------------------------------------------------------------------

export function useAuthContext(): AuthContextValue {
  const user = useAtomValue(userAtom);
  const hydrated = useAtomValue(isHydratedAtom);

  const permissions = useMemo<Permission[]>(() => {
    if (!user) return [];
    // Phase 1: client-side matrix. Phase 2: user.permissions ?? fallback.
    return (
      (user.permissions as Permission[] | undefined) ??
      getPermissionsForRole(normalizeRole(user.role))
    );
  }, [user]);

  return {
    user,
    loading: !hydrated,
    authenticated: hydrated && user !== null,
    unauthenticated: hydrated && user === null,
    permissions,
  };
}
