# show-ring-mobile

React Native port of `show-ring` web (Next.js + MUI 7). Expo SDK 55, new architecture.

## Getting started

```bash
npm install
npx expo start
```

For iOS simulator: `npm run ios` · For Android: `npm run android`.

## Validation before commit

```bash
npm run check:all
```

Runs `expo-doctor`, `tsc --noEmit`, `eslint`, `prettier --check`. Must exit 0.

## Documentation

- **Full implementation plan:** `docs/plans/2026-04-22-react-native-port-plan.md`
- **Stage progress tracker:** `PROGRESS.md`
- **AI working guide:** `CLAUDE.md`
- **Project-specific Claude skills:** `.claude/skills/`

## Architecture at a glance

- `app/` — Expo Router screens (file-based, mirrors Next.js `src/app/` on web).
- `src/components/mui/` — MUI-compatible adapter over `react-native-paper`. Screens import from here, never from `@mui/material`.
- `src/theme/` — tokens copied from web (palette identical, typography/shadows adapted for RN).
- `src/lib/` — axios, swr, storage, secure-storage.
- `src/auth/` — auth context and providers ported from web.
- `src/sections/`, `src/layouts/`, `src/routes/`, `src/utils/`, `src/types/`, `src/locales/` — mirror the web project.

## Non-goals

- No `react-native-web`, no direct `@mui/material` use.
- No Legacy Architecture — SDK 55 requires New Architecture (Fabric + TurboModules).
