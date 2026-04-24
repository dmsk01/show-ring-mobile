import { Stack } from 'expo-router';
import { PermissionDeniedView } from 'src/sections/permission';

import type { JSX } from 'react';

export default function PermissionPage(): JSX.Element {
  return (
    <>
      <Stack.Screen options={{ title: 'Permission' }} />
      <PermissionDeniedView />
    </>
  );
}
