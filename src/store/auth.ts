import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

import { storage } from '../lib/storage';

// Адаптер для MMKV
const mmkvStorage = createJSONStorage<unknown>(() => storage);

// Атом пользователя (сохраняется в MMKV)
export const userAtom = atomWithStorage('user-data', null, mmkvStorage);

// Производный атом для проверки авторизации
export const isAuthAtom = atom((get) => get(userAtom) !== null);

export const isHydratedAtom = atom(false);
