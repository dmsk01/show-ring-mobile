import { Stack } from 'expo-router';
import { View403 } from 'src/sections/error';

import type { JSX } from 'react';

export default function Page403(): JSX.Element {
  return (
    <>
      <Stack.Screen options={{ title: 'Forbidden' }} />
      <View403 />
    </>
  );
}
