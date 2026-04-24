/**
 * jotai atoms for auth state.
 *
 * Diverges from the web template (React Context + reducer) — rationale in
 * `CLAUDE.md` §"Auth — divergence from web" and
 * `memory/feedback_mobile_divergence.md`.
 *
 * - `userAtom`: persisted in MMKV via sync adapter (no async hydration).
 * - `isAuthAtom`: derived — avoids re-deriving in every component.
 * - `isHydratedAtom`: flips true once token bootstrap in `_layout.tsx` finishes.
 */

import { atom } from 'jotai';
import { storage } from 'src/lib/storage';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

import type { UserType } from '../types';

// ----------------------------------------------------------------------

const USER_STORAGE_KEY = 'auth-user';

const mmkvJsonStorage = createJSONStorage<UserType>(() => storage);

export const userAtom = atomWithStorage<UserType>(USER_STORAGE_KEY, null, mmkvJsonStorage);

export const isAuthAtom = atom((get) => get(userAtom) !== null);

export const isHydratedAtom = atom(false);
