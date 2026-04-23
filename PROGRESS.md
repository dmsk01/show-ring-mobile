# show-ring-mobile — Progress

Live checklist. Update in the same commit as the code change. See `docs/plans/2026-04-22-react-native-port-plan.md` for the full plan.

**Current stage:** Stage 1 — MVP, substage **1.3 Base infrastructure**.

Legend: `[ ]` todo · `[~]` in progress · `[x]` done · `[-]` skipped/YAGNI

---

## Stage 1 — MVP

### 1.1 Skeleton & infra
- [x] `package.json` scaffolded with all Stage 1 deps pinned to plan §2 versions
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
- [ ] src/locales/ copied verbatim
- [ ] Replace language detector with expo-localization
- [ ] MMKV persistence for language override
- [ ] LocalizationProvider registered in app/_layout.tsx

### 1.5 Auth (JWT)
- [ ] src/auth/context/ ported
- [ ] src/auth/hooks/ ported
- [ ] src/auth/providers/jwt/ adapted (secure-store)
- [ ] src/auth/utils.ts ported
- [ ] app/(auth)/sign-in.tsx
- [ ] app/(auth)/sign-up.tsx
- [ ] app/(auth)/forgot-password.tsx
- [ ] AuthGuard, GuestGuard
- [ ] Deep-linking config in app.json

### 1.6 Layouts & navigation
- [ ] app/_layout.tsx (providers stack)
- [ ] app/(auth)/_layout.tsx
- [ ] app/(dashboard)/_layout.tsx (Tabs)
- [ ] src/layouts/DashboardLayout.tsx
- [ ] src/layouts/AuthLayout.tsx

### 1.7 End-to-end screen
- [ ] app/(dashboard)/index.tsx (Overview)
- [ ] app/(dashboard)/settings.tsx (theme, language, logout)
- [ ] iOS simulator run
- [ ] Android emulator run

### 1.8 MVP validation
- [ ] yarn check:all green
- [ ] eas build --profile development --platform ios
- [ ] eas build --profile development --platform android
- [ ] TestFlight internal build
- [ ] src/components/mui/README.md finalized

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
