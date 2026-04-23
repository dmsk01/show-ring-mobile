import i18next from 'i18next';
import { storage } from 'src/lib/storage';
import * as Localization from 'expo-localization';
import { initReactI18next, I18nextProvider as Provider } from 'react-i18next';

import {
  fallbackLng,
  i18nOptions,
  supportedLngs,
  languageStorageKey,
  i18nResourceLoader,
  type LangCode,
} from './locales-config';

import type { ReactNode, JSX } from 'react';

// ----------------------------------------------------------------------

function detectInitialLang(): LangCode {
  const stored = storage.getItem(languageStorageKey);
  if (stored && (supportedLngs as readonly string[]).includes(stored)) {
    return stored as LangCode;
  }

  const deviceLangCode = Localization.getLocales()[0]?.languageCode ?? null;
  if (deviceLangCode && (supportedLngs as readonly string[]).includes(deviceLangCode)) {
    return deviceLangCode as LangCode;
  }

  return fallbackLng;
}

/**
 * Custom i18next language detector backed by MMKV + expo-localization.
 * Replaces `i18next-browser-languagedetector` (web-only).
 */
const mmkvLanguageDetector = {
  type: 'languageDetector' as const,
  async: false,
  init: (): void => {},
  detect: (): LangCode => detectInitialLang(),
  cacheUserLanguage: (lang: string): void => {
    storage.setItem(languageStorageKey, lang);
  },
};

// Initialize once at module load (mirrors web i18n-provider behavior).
if (!i18next.isInitialized) {
  i18next
    .use(mmkvLanguageDetector)
    .use(initReactI18next)
    .use(i18nResourceLoader)
    .init(i18nOptions(detectInitialLang()));
}

// ----------------------------------------------------------------------

type I18nProviderProps = {
  children: ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps): JSX.Element {
  return <Provider i18n={i18next}>{children}</Provider>;
}
