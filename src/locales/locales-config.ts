import resourcesToBackend from 'i18next-resources-to-backend';

import enCommon from './langs/en/common.json';
import ruCommon from './langs/ru/common.json';
import enNavbar from './langs/en/navbar.json';
import ruNavbar from './langs/ru/navbar.json';
import enMessages from './langs/en/messages.json';
import ruMessages from './langs/ru/messages.json';

import type { InitOptions } from 'i18next';

// ----------------------------------------------------------------------

// Supported languages
export const supportedLngs = ['en', 'ru'] as const;
export type LangCode = (typeof supportedLngs)[number];

// Supported namespaces
export const supportedNamespaces = ['common', 'messages', 'navbar'] as const;
export type Namespace = (typeof supportedNamespaces)[number];

// Fallback and default namespace
export const fallbackLng: LangCode = 'en';
export const defaultNS: Namespace = 'common';

// MMKV key for persisted language override
export const languageStorageKey = 'i18nextLng';

// ----------------------------------------------------------------------

/**
 * @countryCode https://flagcdn.com/en/codes.json
 * @adapterLocale https://github.com/iamkun/dayjs/tree/master/src/locale
 * @numberFormat https://simplelocalize.io/data/locales/
 */

export type LangOption = {
  value: LangCode;
  label: string;
  countryCode: string;
  adapterLocale: string;
  numberFormat: { code: string; currency: string };
};

export const allLangs: LangOption[] = [
  {
    value: 'en',
    label: 'English',
    countryCode: 'GB',
    adapterLocale: 'en',
    numberFormat: { code: 'en-US', currency: 'USD' },
  },
  {
    value: 'ru',
    label: 'Русский',
    countryCode: 'RU',
    adapterLocale: 'ru',
    numberFormat: { code: 'ru-RU', currency: 'RUB' },
  },
];

// ----------------------------------------------------------------------

type ResourceMap = Record<LangCode, Record<Namespace, object>>;

const resources: ResourceMap = {
  en: { common: enCommon, messages: enMessages, navbar: enNavbar },
  ru: { common: ruCommon, messages: ruMessages, navbar: ruNavbar },
};

/**
 * Static resource loader for Metro-bundled JSON.
 *
 * Web uses dynamic `import('./langs/${lang}/${ns}.json')`, which Metro
 * cannot resolve reliably. We preload all resources at module load time
 * (5 files × ~10 lines each — trivial bundle cost) and expose them via
 * `i18next-resources-to-backend` so the i18next init chain mirrors web.
 */
export const i18nResourceLoader = resourcesToBackend(
  (lang: string, namespace: string) => resources[lang as LangCode]?.[namespace as Namespace] ?? {}
);

export function i18nOptions(
  lang: LangCode = fallbackLng,
  namespace: Namespace = defaultNS
): InitOptions {
  return {
    supportedLngs: [...supportedLngs],
    fallbackLng,
    lng: lang,
    fallbackNS: defaultNS,
    defaultNS,
    ns: namespace,
    interpolation: { escapeValue: false },
  };
}

export function getCurrentLang(lang?: string): LangOption {
  const fallbackLang = allLangs.find((l) => l.value === fallbackLng) ?? allLangs[0];

  if (!lang) {
    return fallbackLang;
  }

  return allLangs.find((l) => l.value === lang) ?? fallbackLang;
}
