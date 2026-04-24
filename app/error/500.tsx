import { Stack } from 'expo-router';
import { View500 } from 'src/sections/error';

import type { JSX } from 'react';

export default function Page500(): JSX.Element {
  return (
    <>
      <Stack.Screen options={{ title: 'Server error' }} />
      <View500 />
    </>
  );
}
