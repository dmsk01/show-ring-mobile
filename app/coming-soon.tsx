import { Stack } from 'expo-router';
import { ComingSoonView } from 'src/sections/coming-soon';

import type { JSX } from 'react';

export default function ComingSoonPage(): JSX.Element {
  return (
    <>
      <Stack.Screen options={{ title: 'Coming soon' }} />
      <ComingSoonView />
    </>
  );
}
