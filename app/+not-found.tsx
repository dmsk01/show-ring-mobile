import { Stack } from 'expo-router';
import { NotFoundView } from 'src/sections/error';

import type { JSX } from 'react';

export default function NotFoundScreen(): JSX.Element {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <NotFoundView />
    </>
  );
}
