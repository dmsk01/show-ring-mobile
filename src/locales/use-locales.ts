import dayjs from 'dayjs';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { fallbackLng, getCurrentLang, type LangCode, type LangOption } from './locales-config';

import type { Namespace as I18nNamespace } from 'i18next';

// ----------------------------------------------------------------------

type UseTranslateReturn = {
  t: ReturnType<typeof useTranslation>['t'];
  i18n: ReturnType<typeof useTranslation>['i18n'];
  currentLang: LangOption;
  onChangeLang: (lang: LangCode) => Promise<void>;
  onResetLang: () => Promise<void>;
};

export function useTranslate(namespace?: I18nNamespace): UseTranslateReturn {
  const { t, i18n } = useTranslation(namespace);

  const currentLang = getCurrentLang(i18n.resolvedLanguage);

  const handleChangeLang = useCallback(
    async (lang: LangCode): Promise<void> => {
      await i18n.changeLanguage(lang);
      const updatedLang = getCurrentLang(lang);
      dayjs.locale(updatedLang.adapterLocale);
    },
    [i18n]
  );

  const handleResetLang = useCallback(
    async (): Promise<void> => handleChangeLang(fallbackLng),
    [handleChangeLang]
  );

  return {
    t,
    i18n,
    currentLang,
    onChangeLang: handleChangeLang,
    onResetLang: handleResetLang,
  };
}
