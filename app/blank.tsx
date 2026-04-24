import { Stack } from 'expo-router';
import { BlankView } from 'src/sections/blank';

import type { JSX } from 'react';

export default function BlankPage(): JSX.Element {
  return (
    <>
      <Stack.Screen options={{ title: 'Blank' }} />
      <BlankView />
    </>
  );
}
