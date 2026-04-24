# React Native Port Plan — show-ring-mobile

**Date:** 2026-04-22
**Source project:** `G:/Work/show-ring` (Next.js 16 + MUI 7 + TS, Minimal Kit template v7.4.0)
**Target project:** `G:/Work/show-ring-mobile`
**Approach:** true React Native (Expo SDK 55, new architecture), not `react-native-web`.
**Goal:** mobile app visually and API-wise close to the web project, reusing all non-DOM logic as-is.

---

## Table of Contents
1. [Context & Decisions](#1-context--decisions)
2. [Stack & Versions (April 2026)](#2-stack--versions)
3. [Project Structure](#3-project-structure)
4. [Stage 1 — MVP (detailed)](#4-stage-1--mvp)
5. [Stage 2 — Heavy UI](#5-stage-2--heavy-ui)
6. [Stage 3 — Simple Sections](#6-stage-3--simple-sections)
7. [Stage 4 — Sections with External Libs](#7-stage-4--sections-with-external-libs)
8. [Stage 5 — Business Sections](#8-stage-5--business-sections)
9. [Stage 6 — Extra Auth & Native Features](#9-stage-6--extra-auth--native-features)
10. [Stage 7 — YAGNI / Optional](#10-stage-7--yagni--optional)
11. [Process & Validation](#11-process--validation)
12. [Decisions Log](#12-decisions-log)
13. [Risk Log](#13-risk-log)

---

## 1. Context & Decisions

The web template ships 30+ business sections, heavy third-party components (DataGrid, Tiptap editor, ApexCharts, FullCalendar, MapLibre) and four auth providers (Auth0, Firebase, Supabase, AWS Amplify). The mobile port cannot copy MUI as-is: `@mui/material` is DOM-only. We chose:

- **Expo + true React Native** — native primitives, native gestures, access to camera/biometrics/push. Not `react-native-web` (web-in-webview trap, App Store Guideline 4.2 risk, perf lags on lists).
- **React Native Paper** as the Material Design foundation + a thin **MUI-compatible adapter layer** (`src/components/mui/`). Component names, prop names and values match MUI (`<Button variant="contained">`, `<Stack direction spacing>`, `<Typography variant>`), so section code ports almost mechanically.
- **Expo Router** (file-based) mirrors Next.js `app/` directory, enabling near-1:1 mapping from web routes.
- **Align-with-web versions** for shared business libs (hook-form, zod, swr, axios, i18next, dayjs) to keep behavior identical. Latest versions only for RN-specific libs.
- **Auth MVP:** JWT with `expo-secure-store`. Google OAuth + SMS/email 2FA deferred to Stage 6.
- **MVP-first:** Stage 1 builds base + theme + adapter + JWT + one end-to-end flow. Everything else is incremental.

---

## 2. Stack & Versions

**Verified against npm registry on 2026-04-22.** Pin exact versions in `package.json`; do not use `^`/`~` for RN-native packages (Expo SDK contract).

### Expo / RN core
| Package | Version |
|---|---|
| `expo` | `55.0.17` (SDK 55, stable 2026-02-25) |
| React Native | `0.83` (bundled by SDK 55) |
| React | `19.2` |
| `expo-router` | `55.0.13` |
| `expo-font` | `55.0.6` |
| `expo-linking` | `55.0.14` |
| `expo-constants` | `55.0.15` |
| `expo-localization` | (SDK-matched) |
| `expo-secure-store` | `55.0.13` |
| `expo-local-authentication` | `55.0.13` (Stage 6) |
| `expo-auth-session` | `55.0.15` (Stage 6, Google OAuth) |
| `react-native-safe-area-context` | `5.7.0` |
| `react-native-screens` | `4.24.0` |
| `react-native-reanimated` | `4.3.0` |
| `react-native-gesture-handler` | `2.31.1` |
| `react-native-svg` | `15.15.4` |

**Important:** SDK 55 requires the New Architecture (Fabric + TurboModules). Legacy Arch is removed. All native modules must be New-Arch-compatible.

### UI / lists / storage
| Package | Version | Role |
|---|---|---|
| `react-native-paper` | `5.15.1` | Material components foundation |
| `@shopify/flash-list` | `2.3.1` | virtualized lists, DataGrid base |
| `react-native-mmkv` | `4.3.1` | fast persistent KV storage (New Arch only) |
| `styled-components` | `6.4.1` | stylesheet-per-component (optional, can use StyleSheet) |
| `burnt` | `0.13.0` | native toasts (replaces `sonner`) |
| `@expo/vector-icons` | `15.1.1` | icons (replaces `@iconify/react`) |
| `react-native-pager-view` | `8.0.1` | Tabs implementation |
| `react-native-ui-datepicker` | `3.1.3` | DatePicker |
| `@react-native-community/slider` | `5.2.0` | Slider |
| `@react-native-community/datetimepicker` | `9.1.0` | native-style DateTime (optional) |
| `react-native-skeleton-placeholder` | `5.2.4` | Skeleton |

### Business logic — align with web
| Package | Web | Mobile | Note |
|---|---|---|---|
| `react-hook-form` | 7.62.0 | **7.62.0** | align |
| `@hookform/resolvers` | ^5.2.1 | **5.2.1** | align |
| `zod` | 4.0.15 | **4.0.15** | align |
| `swr` | ^2.3.4 | **^2.3.4** | align |
| `axios` | ^1.11.0 | **^1.11.0** | align |
| `dayjs` | ^1.11.13 | **^1.11.13** | align |
| `i18next` | ^25.3.2 | **^25.3.2** | align (NOT 26.x — breaking) |
| `react-i18next` | ^15.6.1 | **^15.6.1** | align (NOT 17.x — breaking) |
| `i18next-resources-to-backend` | ^1.2.1 | **^1.2.1** | align |

### Replacements for web-only packages
| Web | Mobile | Reason |
|---|---|---|
| `sonner` | `burnt` | sonner is web-only |
| `nprogress` | not needed | Expo Router has screen transition animations |
| `simplebar-react` | not needed | native scroll is smooth |
| `@iconify/react` | `@expo/vector-icons` + SVG assets | iconify renders via `<svg>` |
| `@fontsource-variable/*` | copy `.ttf` to `assets/fonts/` | web-targeted |
| `react-dropzone` | `expo-document-picker` + `expo-image-picker` | file pickers |
| `@react-pdf/renderer` | `expo-print` + share | render HTML→PDF natively |
| `react-markdown` | `react-native-markdown-display` | DOM-based |
| MUI RTL (`@mui/stylis-plugin-rtl`) | `I18nManager.forceRTL` | RN-native |

### Dev tooling
- `typescript` `^5.9.2` (same as web)
- `eslint` `^9.32.0` + adapted config (drop `next/*`, add `eslint-plugin-react-native`)
- `prettier` `^3.6.2` — reuse web `prettier.config.mjs` as-is
- `expo-doctor` — part of Expo CLI, checks native deps alignment

---

## 3. Project Structure

```
show-ring-mobile/
├── .claude/
│   └── skills/                # project-specific Claude skills
├── app/                       # Expo Router, mirrors Next.js src/app/
│   ├── _layout.tsx            # root: providers, fonts, theme
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── forgot-password.tsx
│   ├── (dashboard)/
│   │   ├── _layout.tsx        # tabs
│   │   ├── index.tsx
│   │   └── settings.tsx
│   └── +not-found.tsx
├── assets/
│   ├── fonts/                 # .ttf from @fontsource-variable/*
│   ├── images/
│   └── icons/                 # project SVGs
├── docs/
│   └── plans/                 # design docs and plans
├── src/
│   ├── _mock/                 # copy 1:1 from web
│   ├── actions/               # copy 1:1 (SWR fetchers)
│   ├── auth/                  # copy context/hooks; adapt storage
│   ├── components/
│   │   ├── mui/               # MUI-compatible adapter (core of Stage 1)
│   │   └── custom/            # project-specific RN components
│   ├── hooks/                 # RN-specific hooks
│   ├── layouts/               # dashboard/auth layouts adapted to <Stack>/<Tabs>
│   ├── lib/                   # axios, swr config, storage wrappers
│   ├── locales/               # copy 1:1
│   ├── routes/                # paths.ts copy; hooks wrap expo-router
│   ├── sections/              # port stage by stage
│   ├── theme/                 # see §2
│   ├── types/                 # copy 1:1
│   ├── utils/                 # copy 1:1 (~95% works)
│   └── global-config.ts       # copy 1:1, adapt ENV source
├── app.json                   # Expo config
├── eas.json                   # EAS Build profiles
├── metro.config.js            # + react-native-svg-transformer
├── babel.config.js            # + reanimated/plugin + expo-router/babel
├── tsconfig.json              # paths: { "src/*": ["./src/*"] }
├── eslint.config.mjs          # ported from web, without next/*
├── prettier.config.mjs        # copy from web
├── CLAUDE.md                  # AI guidance
├── PROGRESS.md                # live stage checklist
└── package.json
```

### Migration classification
- **🟢 Copy 1:1 (no changes):** `utils/`, `types/`, `locales/`, `global-config.ts`, `_mock/`, `actions/`, `routes/paths.ts`.
- **🟡 Adapt (same logic, different shell):** `auth/` (storage provider swap), `lib/` (axios, swr, storage), `routes/hooks/` (wrap expo-router), `layouts/` (Stack/Tabs), `theme/` (shadows, fontFamily).
- **🔴 Rewrite:** `components/`, `sections/`, `app/`.
- **⚫ Do not port:** `global.css`, web-specific svg pipelines, `@fontsource-*` node_modules (copy .ttf only).

---

## 4. Stage 1 — MVP

Duration: ~17-18 working days. Deliverable: runnable app with theme, JWT auth, dashboard tabs shell, and 20+ adapter components covering ~95% of typical screens.

### 1.1 Skeleton & infra (day 1)
- [ ] `npx create-expo-app@latest show-ring-mobile --template expo-template-blank-typescript` — already in target path.
- [ ] `npx expo install expo-router expo-font expo-linking expo-constants expo-localization expo-secure-store react-native-safe-area-context react-native-screens react-native-reanimated react-native-gesture-handler react-native-svg`
- [ ] `npm i react-native-paper @shopify/flash-list react-native-mmkv burnt @expo/vector-icons`
- [ ] `npm i react-hook-form@7.62.0 @hookform/resolvers@^5.2.1 zod@4.0.15 swr@^2.3.4 axios@^1.11.0 dayjs@^1.11.13 i18next@^25.3.2 react-i18next@^15.6.1 i18next-resources-to-backend@^1.2.1` (es-toolkit deferred to stage 2 — see §5; Stage 1 uses a local kebabCase util)
- [ ] `app.json`: `"newArchEnabled": true`, `"scheme": "showring"`, icon/splash placeholders.
- [ ] `babel.config.js`: `expo-router/babel` + `react-native-reanimated/plugin` (last).
- [ ] `metro.config.js`: integrate `react-native-svg-transformer`.
- [ ] `tsconfig.json`: `"paths": { "src/*": ["./src/*"] }`, `"strict": true`, target ES2022.
- [ ] Port `eslint.config.mjs` from web: drop `next/*`; add `eslint-plugin-react-native`; keep `perfectionist`, `import`, `unused-imports`.
- [ ] Copy `prettier.config.mjs` from web verbatim.
- [ ] Add scripts: `start`, `ios`, `android`, `lint`, `lint:fix`, `fm:check`, `fm:fix`, `tsc:watch`, `check:all` (see §11).
- [ ] Commit `setup: initial expo project with eslint, prettier, tsconfig`.

### 1.2 Theme & MUI adapter (days 2-4)
- [ ] Copy `src/theme/core/palette.ts` from web verbatim.
- [ ] Port `src/theme/core/typography.ts`: swap web `fontFamily` names to RN-registered family names.
- [ ] Create `src/theme/core/shadows.ts`: function `muiShadowToRN(level: 0-24)` → `{ elevation, shadowColor, shadowOpacity, shadowRadius, shadowOffset }`.
- [ ] Copy `src/theme/core/custom-shadows.ts` with same adapter.
- [ ] Create `src/theme/create-theme.ts` combining palette + typography + shadows + spacing (`sp = n => n * 8`) + breakpoints.
- [ ] Create `src/theme/theme-provider.tsx` wrapping `<PaperProvider>` + React context with mode (light/dark) persisted via MMKV.
- [ ] `src/theme/hooks/use-theme.ts`, `src/theme/hooks/use-responsive.ts` (uses `useWindowDimensions`).
- [ ] Copy font `.ttf` files from `node_modules/@fontsource-variable/public-sans/files/*` into `assets/fonts/`.
- [ ] Register fonts via `expo-font` in `app/_layout.tsx`.
- [ ] Implement `src/components/mui/` adapter set (see list below). Each component: own file, prop names and values mirror MUI, internal impl via Paper/RN primitives.

**Stage 1 adapter components (all required):**
Box, Stack, Typography, Button, IconButton, TextField, Card (+CardContent, CardHeader, CardActions), Divider, CircularProgress, LinearProgress, Switch, Checkbox, Radio, Avatar, Chip, Dialog, Snackbar, Tabs, Accordion, Menu, Tooltip, Badge, Breadcrumbs, Skeleton, Slider, Autocomplete, DatePicker, DataGrid (simplified: columns, rows, onSortChange, loading, pagination — no resize/filters/pinning).

### 1.3 Base infrastructure (day 5)
- [ ] `src/lib/axios.ts` — port web instance with interceptors; replace token source with `expo-secure-store`.
- [ ] `src/lib/swr.ts` — config; focus revalidation via `AppState` listener (replaces `window.focus`).
- [ ] `src/lib/storage.ts` — MMKV wrapper with `getItem/setItem/removeItem`.
- [ ] `src/lib/secure-storage.ts` — expo-secure-store wrapper, same interface.
- [ ] Copy `src/utils/*` 1:1. Verify every utility — any that uses `window`/`document`/`navigator` — fix or drop.
- [ ] Copy `src/types/*` 1:1.
- [ ] Copy `src/global-config.ts`, adapt ENV source: `Constants.expoConfig?.extra`.
- [ ] Copy `src/routes/paths.ts` verbatim.
- [ ] Implement `src/routes/hooks/` wrappers around expo-router: `useRouter`, `usePathname`, `useSearchParams`, `useParams` with MUI-web-compatible API.

### 1.4 i18n (day 6)
- [ ] Copy `src/locales/` verbatim (all JSON resources, `i18n.ts`, `localization-provider.tsx`).
- [ ] Replace `i18next-browser-languagedetector` with `expo-localization` (read `Localization.getLocales()[0].languageCode`).
- [ ] Language persistence via MMKV.
- [ ] Register provider in `app/_layout.tsx`.

### 1.5 Auth — JWT (days 7-9)
- [ ] Copy `src/auth/context/` (AuthContext, AuthProvider, types) — React Context, works as-is.
- [ ] Copy `src/auth/hooks/` (`useAuthContext`, `useMockedUser`, etc.).
- [ ] Adapt `src/auth/providers/jwt/`: token storage → `expo-secure-store`; refresh flow unchanged; logout clears secure storage.
- [ ] Copy `src/auth/utils.ts` (jwt decode, token validators).
- [ ] Screens: `app/(auth)/sign-in.tsx`, `sign-up.tsx`, `forgot-password.tsx` using hook-form + zod resolver + adapter components.
- [ ] Guards: `AuthGuard`, `GuestGuard` — use `<Redirect href="/(auth)/sign-in">` from expo-router.
- [ ] Deep linking setup in `app.json` for password reset / email verification flow.

### 1.6 Layouts & navigation (days 10-11)
- [ ] `app/_layout.tsx` root: `SafeAreaProvider > GestureHandlerRootView > PaperProvider > ThemeProvider > LocalizationProvider > AuthProvider > SettingsProvider > SWRConfig > <Slot/>`.
- [ ] `app/(auth)/_layout.tsx` — Stack with header hidden, fade transitions.
- [ ] `app/(dashboard)/_layout.tsx` — Tabs with 3-4 entries (Dashboard, Browse, Account, More).
- [ ] `src/layouts/DashboardLayout` — wraps tab content, provides header slot.
- [ ] `src/layouts/AuthLayout` — logo + centered form.
- [ ] Drawer for settings/profile via `@react-navigation/drawer` (optional; tab "More" can be enough in MVP).

### 1.7 One end-to-end screen (day 12)
- [ ] `app/(dashboard)/index.tsx` "Overview" — 3-4 adapter components sampled (Card, Stack, Typography, Button).
- [ ] `app/(dashboard)/settings.tsx` — theme toggle, language picker, logout button.
- [ ] Verify: login → dashboard → logout loop works on iOS simulator and Android emulator.

### 1.8 MVP validation (days 13-17)
- [ ] `yarn check:all` green.
- [ ] `eas build --profile development --platform ios` and `--platform android` succeed.
- [ ] Smoke test on a real device (TestFlight internal).
- [ ] Document adapter API in `src/components/mui/README.md` (which MUI props supported, which ignored).

### Stage 1 exit criteria
1. App builds on both platforms with new arch.
2. `check:all` passes (tsc + eslint + prettier + expo-doctor).
3. Auth loop works; tokens stored in Keychain/Keystore.
4. Theme toggles light/dark instantly; fonts load on startup.
5. i18n toggles at runtime without restart.
6. All 25 adapter components rendered on the Overview screen sample.

---

## 5. Stage 2 — Heavy UI

Prereq: Stage 1 done.

- [ ] **DataGrid (full)** — port of `@mui/x-data-grid` API: column resize, reorder, pinning, UI filters, selection, tree rows, pagination bar. Base: FlashList + custom column engine. Est. 2 weeks.
- [ ] **TreeView** — recursive FlashList with animated expand/collapse (Reanimated). Est. 2 days.
- [ ] Additional MUI components as demanded: Rating, Stepper, SpeedDial, Pagination, BottomNavigation styled variant.
- [ ] Icon coverage extension: wrap `react-native-iconify` or add SVG packs via `react-native-svg-transformer`.

## 6. Stage 3 — Simple Sections

Sections where logic already works (forms + SWR fetchers); only UI rebuild needed.

- [ ] `overview/` — dashboards, KPI cards.
- [ ] `account/` — profile forms, password change, notifications.
- [ ] `about/`, `contact/`, `faqs/`, `pricing/`, `permission/`.
- [ ] `error/`, `maintenance/`, `coming-soon/`.
- [ ] `blank/` — template screen.

Priority: `overview` → `account` → rest.

## 7. Stage 4 — Sections with External Libs

| Web section | Web pkg | Mobile replacement | Version | Complexity |
|---|---|---|---|---|
| `chart/` | apexcharts | `react-native-gifted-charts` 1.4.x OR `victory-native` 41.x | — | medium |
| `carousel` | embla-carousel | `react-native-reanimated-carousel` 4.x | — | low |
| `editor/` | @tiptap | `@10play/tentap-editor` 0.7.x (RN Tiptap port) | — | medium |
| `map/` | maplibre-gl + react-map-gl | `@rnmapbox/maps` 10.x OR `react-native-maps` 1.x | — | high (native) |
| `calendar/` | @fullcalendar | `react-native-calendars` 1.x | — | medium |
| `lightbox/` | yet-another-react-lightbox | `react-native-image-viewing` 0.2.x | — | low |
| `file-manager/` upload | react-dropzone | `expo-document-picker` + `expo-image-picker` | — | low |
| `markdown/` | react-markdown | `react-native-markdown-display` 7.x | — | low |
| `kanban/` DnD | @atlaskit/pragmatic-drag-and-drop | `react-native-draggable-flatlist` 4.x + Reanimated | — | high |
| `organizational-chart` | react-organizational-chart | custom on Reanimated + react-native-svg | — | medium |
| `phone-input` | react-phone-number-input | `react-native-phone-number-input` 2.x | — | low |
| `number-input` OTP | mui-one-time-password-input | `react-native-otp-entry` 1.x | — | low |

## 8. Stage 5 — Business Sections

Depends on Stages 3-4.
- [ ] `product/` — listing, details, cart.
- [ ] `order/`, `invoice/` — (PDF in Stage 6).
- [ ] `user/` — list (needs full DataGrid from Stage 2).
- [ ] `blog/` — list, details, edit (needs editor from Stage 4).
- [ ] `chat/`, `mail/` — WebSocket + custom state.
- [ ] `job/`, `tour/` — filtered listings.
- [ ] `kanban/` — needs DnD from Stage 4.
- [ ] `checkout/` — forms + payment SDK (Stage 6).
- [ ] `file-manager/` — document-picker + TreeView.

## 9. Stage 6 — Extra Auth & Native Features

- [ ] **Google OAuth** via `expo-auth-session` Google provider.
- [ ] **SMS 2FA** via Firebase Phone Auth (`@react-native-firebase/auth` 22.x) or Twilio Verify.
- [ ] **Email magic link** via deep link (`expo-linking` + `app.json` associatedDomains).
- [ ] **Biometrics** for app unlock via `expo-local-authentication`.
- [ ] **Push notifications** via `expo-notifications`.
- [ ] **PDF generation** for invoices via `expo-print` + `expo-sharing`.

## 10. Stage 7 — YAGNI / Optional

Listed for completeness; implement only on explicit request.

- [ ] `_examples/` sections — demos, skip entirely.
- [ ] MUI RTL — only if Arabic/Hebrew users appear.
- [ ] `@react-pdf/renderer` replacement with expo-print is default — advanced PDF templating only if needed.
- [ ] `aws-amplify` — unlikely; Auth0/Firebase covers the use case.
- [ ] `@fullcalendar/*` full feature parity — mobile calendar often simpler.
- [ ] `react-organizational-chart` — only if business case remains.
- [ ] DataGrid Excel export — CSV share is enough.

---

## 11. Process & Validation

### Before each task
1. Re-read relevant section of this plan.
2. If scope expands / changes — **update this plan first**, then code.

### After each task
1. Mark checkbox in `PROGRESS.md`.
2. Commit code + plan/progress updates together.

### Mandatory: `check:all`
```json
"check:all": "expo-doctor && tsc --noEmit && eslint \"**/*.{ts,tsx}\" && prettier --check \"**/*.{ts,tsx}\""
```
Must exit 0 before every commit and before closing any stage.

### Per-stage gates
- **Stage 1:** daily simulator/emulator run; `check:all` green; `eas build --profile development` green on both platforms.
- **Stage 2+:** per-feature device smoke test; `check:all` green; build green.

### Commit convention
Prefixes: `setup:`, `theme:`, `auth:`, `screen:`, `plan:`, `fix:`, `deps:`, `refactor:`.

---

## 12. Decisions Log

| # | Decision | Reason |
|---|---|---|
| D1 | True RN, not `react-native-web` | Native API access, perf, App Store 4.2, no WebView trap |
| D2 | Expo Router | File-based, mirrors Next.js app/, native transitions built-in |
| D3 | RN Paper + MUI-compatible adapter | Material out-of-box + API familiarity for section ports |
| D4 | Separate repo `show-ring-mobile/` | Independent versioning, simpler CI, clean package.json |
| D5 | Align-with-web for shared libs | i18n dictionaries and logic compatibility outweigh "latest" |
| D6 | Latest for RN-specific libs | Required for New Arch compatibility in SDK 55 |
| D7 | JWT in MVP; Google/2FA deferred | Minimize Stage 1 scope |
| D8 | Simplified DataGrid in Stage 1, full in Stage 2 | 95% of screens need sorting+pagination only |
| D9 | TreeView deferred to Stage 2 | Used only in file-manager |
| D10 | expo-secure-store for tokens, MMKV for everything else | Secure storage vs speed trade-off |

## 13. Risk Log

| # | Risk | Mitigation |
|---|---|---|
| R1 | New Arch incompatibility of a community lib at Stage 4-5 | Check compatibility before adoption; keep plan B (victory-native vs gifted-charts, rnmapbox vs react-native-maps) |
| R2 | Font metrics differ iOS/Android vs web → visual drift | Introduce `lineHeightMultiplier` per platform; screenshot review |
| R3 | Adapter ≠ full MUI API (sx media queries, deep selectors) | Document supported props in `src/components/mui/README.md`; throw on unsupported |
| R4 | Apple App Review rejects "wrapped website" | N/A — we use true RN |
| R5 | Bundle size ~20-30 MB | Acceptable for RN; re-check at Stage 5 |
| R6 | i18next 25→26 breaking when web upgrades | Plan a joint upgrade; meanwhile pin both to 25 |
| R7 | Tiptap web extensions not 1:1 with tentap-editor | List required extensions before Stage 4 editor work |
| R8 | Auth provider divergence (Firebase RN ≠ Firebase web API surface) | Abstract via `auth/providers/` interface, already done in web |
