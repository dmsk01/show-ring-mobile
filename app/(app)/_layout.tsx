import { useAtomValue } from 'jotai';
import { Redirect, Stack } from 'expo-router';

import { isAuthAtom, isHydratedAtom } from '../../src/store/auth';

export default function AppLayout() {
  const isAuth = useAtomValue(isAuthAtom);
  const isHydrated = useAtomValue(isHydratedAtom);

  if (!isHydrated) return null; // Ждем окончания инициализации
  if (!isAuth) return <Redirect href="/login" />;

  return <Stack />;
}
