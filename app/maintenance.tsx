import { Stack } from 'expo-router';
import { MaintenanceView } from 'src/sections/maintenance';

import type { JSX } from 'react';

export default function MaintenancePage(): JSX.Element {
  return (
    <>
      <Stack.Screen options={{ title: 'Maintenance' }} />
      <MaintenanceView />
    </>
  );
}
