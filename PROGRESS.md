# show-ring-mobile — Progress

Live checklist. Update in the same commit as the code change. See `docs/plans/2026-04-22-react-native-port-plan.md` for the full plan.

**Current stage:** Stage 1 — MVP, substage **1.7 End-to-end screen** — code done. Pending: iOS simulator + Android emulator runs (user).

Legend: `[ ]` todo · `[~]` in progress · `[x]` done · `[-]` skipped/YAGNI

---

## Stage 1 — MVP

### 1.1 Skeleton & infra

**Divergence from plan §2 deps table:**
- `es-toolkit` deferred to Stage 2 (not installed in Stage 1). Rationale: its root entry loads `AbortError.mjs`, which references the DOM-only `DOMException` and crashes under Hermes on first render. Stage 1 only needed `kebabCase` for post-title slugs in `paths.ts`; replaced with a local 6-line util at `src/utils/kebab-case.ts`. When `es-toolkit` returns in Stage 2 (for `debounce` etc.), use narrow submodule imports (`es-toolkit/array`, `es-toolkit/string`, …).
- Reanimated babel plugin: `react-native-reanimated/plugin` → `react-native-worklets/plugin` in `babel.config.js`. In Reanimated v4+ the plugin was moved to the `react-native-worklets` package; the old path produces broken worklet transforms and bundle-level syntax errors.

- [x] `package.json` scaffolded with all Stage 1 deps pinned to plan §2 versions (minus `es-toolkit`, see divergence above)
- [x] `app.json` with newArchEnabled, scheme, plugins (expo-router, expo-font, expo-secure-store, expo-localization, expo-splash-screen)
- [x] `babel.config.js` with reanimated plugin last
- [x] `metro.config.js` with svg-transformer
- [x] `tsconfig.json` with path aliases (`src/*`) and strict mode
- [x] `eslint.config.mjs` (ported conventions, drops next/*, adds eslint-plugin-react-native)
- [x] `prettier.config.mjs` (copy of web rules)
- [x] `.gitignore`, `expo-env.d.ts`
- [x] Minimal `app/_layout.tsx`, `app/index.tsx`, `app/+not-found.tsx` placeholders
- [x] `npm install` executed in `G:/Work/show-ring-mobile/`
- [ ] **NEXT:** `git init` + initial commit (`setup: scaffold expo-router project with stage-1 dependencies`)
- [x] `npm run check:all` green (18/18 doctor checks, tsc, eslint, prettier)
- [x] Asset placeholders: `assets/images/{icon,splash,adaptive-icon}.png` (1×1 transparent PNGs, to be replaced)

### 1.2 Theme & MUI adapter
- [x] palette.ts (copy from web — values verbatim, channels computed locally)
- [x] typography.ts (copy + fontFamily names, px fontSize, responsive table)
- [x] shadows.ts (MUI level → RN `RNShadow` props, 0..24)
- [x] custom-shadows.ts (z1..z24 + card/dialog/dropdown + color shadows → RN props)
- [x] opacity.ts (copy verbatim)
- [x] spacing.ts (`sp(n) = n * 8`)
- [x] breakpoints.ts
- [x] create-theme.ts (combines tokens + Paper MD3 theme bridge)
- [x] theme-provider.tsx (PaperProvider + mode context + MMKV persistence + system mode)
- [x] hooks/use-theme.ts
- [x] hooks/use-responsive.ts (+ `pickResponsive` helper)
- [x] src/lib/storage.ts (MMKV wrapper — pulled forward from 1.3, needed by theme)
- [ ] Copy .ttf fonts to assets/fonts/ (awaiting source fonts from @fontsource-variable/*)
- [ ] Register fonts in app/_layout.tsx via expo-font

Adapter components (src/components/mui/):
- [x] Box
- [x] Stack
- [x] Typography
- [x] Button
- [x] IconButton
- [x] TextField
- [x] Card / CardContent / CardHeader / CardActions
- [x] Divider
- [x] CircularProgress
- [x] LinearProgress
- [x] Switch
- [x] Checkbox
- [x] Radio
- [x] Avatar
- [x] Chip
- [x] Dialog
- [x] Snackbar
- [x] Tabs
- [x] Accordion
- [x] Menu
- [x] Tooltip
- [x] Badge
- [x] Breadcrumbs
- [x] Skeleton
- [x] Slider (tap-to-set; drag deferred — TODO(stage-2))
- [x] Autocomplete
- [x] DatePicker (text-input; native calendar deferred — TODO(stage-4))
- [x] DataGrid (simplified)
- [x] src/components/mui/README.md documenting supported props

### 1.3 Base infrastructure
- [x] src/lib/axios.ts (auth header + 401 refresh with queue + fetcher + endpoints)
- [x] src/lib/swr.ts (defaults + `useAppStateRevalidation` replacing window.focus)
- [x] src/lib/storage.ts (MMKV — done in 1.2)
- [x] src/lib/secure-storage.ts (expo-secure-store wrapper + in-process token cache)
- [-] src/utils/* — deferred; `format-number` depends on i18n locales (1.4). Port per-consumer during sections.
- [-] src/types/* — deferred; ported per-consumer when sections land (no dead code policy).
- [x] src/global-config.ts (reads from `Constants.expoConfig.extra`)
- [x] src/routes/paths.ts (mock demo paths dropped; product/user/invoice/post/order/job/tour helpers only)
- [x] src/routes/hooks/ (expo-router wrappers — useRouter/usePathname/useSearchParams/useParams, Next-compatible API)

### 1.4 i18n
- [x] src/locales/ ported (JSON resources verbatim; langs reduced to `en` + `ru` per project scope — fr/vi/cn/ar dropped)
- [x] Custom MMKV + expo-localization language detector (replaces `i18next-browser-languagedetector`)
- [x] MMKV persistence for language override (`languageStorageKey = 'i18nextLng'`)
- [x] `I18nProvider` + `LocalizationProvider` registered in `app/_layout.tsx`
- [x] Static resource bundling via `i18next-resources-to-backend` (Metro can't resolve dynamic JSON imports)
- [x] `useTranslate` hook: drop web-only `toast.promise` / `router.refresh` / `useSettingsContext`; keep `onChangeLang`, `onResetLang`, dayjs locale sync
- [x] `formatNumberLocale` util copied (DOM-free)

### 1.5 Auth (JWT)

**Divergence from plan §4.1.5** (recorded in CLAUDE.md §"Auth — divergence from web"):
- State: jotai (not React Context). `useAuthContext()` keeps web's public shape.
- Guards: expo-router route groups + `<Redirect>` (not `AuthGuard` / `GuestGuard` wrappers).
- MVP scope reduction: sign-up + forgot-password + deep-linking deferred (user scope call).

**Phase A — infrastructure (no UI) — done**
- [x] `src/auth/types.ts` — `AuthUser`, `AuthState`, `AuthContextValue`, `SignInParams`, `SignUpParams`, `SessionPayload`
- [x] `src/auth/store/auth-atoms.ts` — `userAtom` (MMKV-backed), `isAuthAtom`, `isHydratedAtom` (moved from `src/store/auth.ts`)
- [x] `src/auth/utils/jwt.ts` — `jwtDecode`, `isValidToken` (uses global `atob` in RN 0.83; no DOM)
- [x] `src/auth/session.ts` — `storeSession`, `storeTokens`, `clearSession` via `jotai.getDefaultStore()`
- [x] `src/auth/actions/jwt.ts` — plain async `signInWithPassword`, `signUp`, `signOut`, `fetchCurrentUser` (replaces service-object `auth.service.ts`)
- [x] `src/auth/hooks/use-auth-context.ts` — `{ user, loading, authenticated, unauthenticated }` over jotai atoms
- [x] `src/auth/hooks/use-auth-actions.ts` — memoised `{ signIn, signUp, signOut }` wrappers
- [x] `src/auth/index.ts` barrel
- [x] `src/lib/axios.ts` — baseURL = `CONFIG.serverUrl`; added `endpoints.auth.refresh`; 401 interceptor calls `clearSession` on refresh failure
- [x] `app.json` — `extra.apiBaseUrl` → `extra.serverUrl` (aligns with `global-config.ts`)
- [x] `app/_layout.tsx` — bootstrap validates access token via `isValidToken`; calls `clearSession` if invalid/missing; flips `isHydratedAtom`
- [x] Removed: `src/services/auth.service.ts`, `src/store/auth.ts`, `src/hooks/use-auth.ts`, `src/types/auth.ts` (and empty parent dirs)

**Phase B — guards — done**
- [x] `app/(app)/_layout.tsx` — `useAuthContext`; `<Redirect href="/sign-in">` when unauthenticated; Splash while loading
- [x] `app/(auth)/_layout.tsx` — reverse guard: `<Redirect href="/">` when authenticated; Splash while loading
- [x] `src/components/custom/splash-screen.tsx` — MVP Splash placeholder (centered `CircularProgress`). Branded Splash tracked under §1.7.

**Phase C — screens — done (MVP minimum = sign-in only)**
- [x] `src/components/hook-form/form-provider.tsx` — `Form` wrapper mirroring web's API (no `<form>` in RN; submission wired via button `onPress`)
- [x] `src/components/hook-form/rhf-text-field.tsx` — `Controller`-backed wrapper over adapter `TextField`; number coercion inline (drops web-only `minimal-shared/utils` transform helpers)
- [x] `app/(auth)/sign-in.tsx` — RHF + zodResolver + MUI adapter (`Stack`, `Typography`, `RHFTextField`, `Button`); password visibility toggle via Paper `TextInput.Icon`; Burnt toast on failure
- [-] `app/(auth)/sign-up.tsx` — deferred (user scope call)
- [-] `app/(auth)/forgot-password.tsx` — deferred (user scope call)
- [-] Deep-linking config in app.json — deferred with forgot-password

### 1.6 Layouts & navigation

**Divergence from plan §1.6:**
- Route group stays `(app)` (not `(dashboard)` as plan lists) — already established in §1.5 Phase B and in CLAUDE.md §"Auth — divergence from web"; group name is invisible in URLs, renaming would be pure churn.
- `src/layouts/{DashboardLayout,AuthLayout}.tsx` wrappers not created — in expo-router the `app/*/_layout.tsx` file IS the layout. Separate wrappers only pay off once we add chrome beyond Tabs/Stack (drawer, FAB, shared AppBar). Revisit in Stage 2+ if needed.

- [x] `app/_layout.tsx` — providers stack (done in §1.1 + §1.5 Phase A; no changes in §1.6)
- [x] `app/(auth)/_layout.tsx` — reverse guard (done in §1.5 Phase B)
- [x] `app/(app)/_layout.tsx` — Tabs shell with Overview + Settings tabs; MaterialIcons for tab icons; colors/chrome wired via `useTheme()`; auth guard preserved
- [x] `app/(app)/index.tsx` — Overview placeholder (real dashboard content lands in §1.7)
- [x] `app/(app)/settings.tsx` — Settings placeholder stub (theme / language / logout wired in §1.7)
- [-] `src/layouts/DashboardLayout.tsx` — deferred, see divergence above
- [-] `src/layouts/AuthLayout.tsx` — deferred, see divergence above

### 1.7 End-to-end screen

**Divergence from plan §1.7** (mobile scope reduction — see CLAUDE.md memories):
- Settings trimmed to theme mode + sign out. Language switcher dropped — device locale via `expo-localization` is authoritative; ru/en follow the OS. Font size / layout toggles deferred (`TODO(stage-2)`).
- Sign out placed in Settings (no dedicated Profile tab on MVP — one action doesn't warrant a whole tab).

- [x] `app/(app)/index.tsx` — Overview welcome; greets by `user.displayName ?? user.email` via `useAuthContext()`
- [x] `app/(app)/settings.tsx` — theme mode `RadioGroup` (light / dark / system) + sign-out button; Burnt toast on signOut failure; redirect handled by `(app)/_layout.tsx` guard when `authenticated` flips
- [-] Language switcher — dropped (device locale via expo-localization)
- [-] Font size selector — deferred (stage-2)
- [ ] iOS simulator run
- [ ] Android emulator run

### 1.8 MVP validation
- [ ] yarn check:all green
- [ ] eas build --profile development --platform ios
- [ ] eas build --profile development --platform android
- [ ] TestFlight internal build
- [x] src/components/mui/README.md finalized (28/28 adapter components documented with support matrix + deviations)

---

## Stage 2 — Heavy UI  (not started)
See plan §5.

## Stage 3 — Simple Sections  (not started)
See plan §6.

## Stage 4 — Sections with External Libs  (not started)
See plan §7.

## Stage 5 — Business Sections  (not started)
See plan §8.

## Stage 6 — Extra Auth & Native Features  (not started)
See plan §9.

## Stage 7 — YAGNI / Optional  (deferred by default)
See plan §10.
