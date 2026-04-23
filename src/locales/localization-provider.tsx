import 'dayjs/locale/en';
import 'dayjs/locale/ru';
import dayjs from 'dayjs';
import { useEffect } from 'react';

import { useTranslate } from './use-locales';

import type { ReactNode, JSX } from 'react';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

/**
 * Keeps dayjs locale in sync with the active i18next language.
 *
 * Web additionally wraps MUI's `LocalizationProvider` (AdapterDayjs) for
 * date-picker components; React Native has no such adapter, so this
 * component is purely a dayjs-locale side-effect holder.
 */
export function LocalizationProvider({ children }: Props): JSX.Element {
  const { currentLang } = useTranslate();

  useEffect(() => {
    dayjs.locale(currentLang.adapterLocale);
  }, [currentLang.adapterLocale]);

  return <>{children}</>;
}
