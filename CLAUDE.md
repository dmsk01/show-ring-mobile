# show-ring-mobile — Claude Working Guide

Mobile React Native port of `G:/Work/show-ring` (Next.js + MUI 7 template).
You are expected to operate at or above the level of a **senior React Native engineer**.

**Before doing anything, read `docs/plans/2026-04-22-react-native-port-plan.md` in full.** That document is the source of truth; this file is the quick-reference.

---

## Non-negotiable rules

1. **Plan first.** Every change must correspond to a task in `PROGRESS.md`. If it doesn't, stop and either (a) add it to the plan, or (b) ask the user.
2. **`check:all` must pass** before every commit and before closing any stage:
   ```
   yarn check:all   # expo-doctor && tsc --noEmit && eslint && prettier --check
   ```
   If it fails, fix the root cause — never use `--no-verify`, never silence with `// @ts-ignore`, never blanket-disable eslint rules.
3. **No `react-native-web`, no `@mui/material` imports.** MUI is web-only in this repo. Use `src/components/mui/` adapter.
4. **SDK 55 = New Architecture only.** Any native dependency added must be New-Arch (Fabric + TurboModules) compatible. Verify before install.
5. **Align with web versions** for shared business libs (hook-form, zod, swr, axios, i18next 25, react-i18next 15, dayjs, es-toolkit). See plan §2 for exact pins. Do NOT upgrade i18next to 26+ without a paired upgrade in the web project.
6. **YAGNI.** Implement only what the current stage requires. No speculative abstractions, no premature optimization, no "while I'm here" refactors.
7. **No dead code, no stubs without an explicit `// TODO(stage-N): description` tag.** Unused files are deleted, not kept "for later".

---

## Architecture contract

### Adapter layer: `src/components/mui/`
Exports components whose **names, prop names, and prop values mirror `@mui/material`** so section code ports mechanically.

**Supported mapping:**
| Prop family | Supported | Notes |
|---|---|---|
| `variant` | yes — same values | `contained/outlined/text` for Button, etc. |
| `color` | yes — from theme palette | `primary/secondary/info/success/warning/error/inherit` |
| `size` | yes | `small/medium/large` |
| `sx` | partial | flat style object; **no media queries**, no pseudo-selectors |
| `component="..."` | NO | RN has no polymorphic rendering |
| event handlers | yes | `onClick` → maps to `onPress` internally |

Every adapter component file must:
- Be a single default or named export with full TS typing.
- Reuse Paper / RN primitives under the hood; never re-implement gestures or animations from scratch.
- Use theme tokens exclusively (never hardcoded hex / px).
- Include a `displayName`.

### Theme
- Tokens live in `src/theme/core/`. Palette = verbatim from web. Typography = web + RN font family override. Shadows = MUI-level → `{elevation, shadowColor, shadowOpacity, shadowRadius, shadowOffset}`.
- Access via `useTheme()` hook (from `src/theme/hooks/use-theme`). Never import theme directly from `@mui/material`.
- `sp(n) = n * 8`. Spacing is always applied through `sp()`, never raw numbers.

### Routing
- File-based via Expo Router under `app/`.
- Path constants in `src/routes/paths.ts` (copied from web).
- Navigation hooks in `src/routes/hooks/` — wrappers around `expo-router` with **MUI/Next-compatible API** (`useRouter().push(path)`, `useSearchParams().get(key)`). Sections must import from `src/routes/hooks/`, never directly from `expo-router`.

### Storage
- **Tokens / secrets → `src/lib/secure-storage.ts`** (expo-secure-store, Keychain/Keystore).
- **Everything else → `src/lib/storage.ts`** (MMKV).
- Never use `AsyncStorage` directly.

### Data fetching
- HTTP via `src/lib/axios.ts` (interceptors: auth token, 401 refresh, error normalization).
- Cache via SWR (`src/lib/swr.ts`).
- Fetchers live in `src/actions/*`, copied from web, same function signatures.

### Auth
- Context in `src/auth/context/` (copied from web).
- Providers under `src/auth/providers/<name>/`; current stage supports only `jwt`.
- Token persistence via secure-storage only.

### i18n
- `src/locales/` copied from web verbatim.
- Provider in `app/_layout.tsx`.
- Language detection via `expo-localization`, override persisted via MMKV.

### Lists
- Use `@shopify/flash-list` for any list with > ~20 items or with heterogeneous item sizes. Use `FlatList` only for trivial static lists.

---

## Coding standards (senior-level bar)

### TypeScript
- `strict: true`. No `any`. If a third-party type is missing, augment in `src/types/` — never `as any`.
- Explicit return types on all exported functions and components.
- No non-null assertions (`!`) except on DOM-equivalents that RN does not have — which means effectively never.
- Prefer `type` for unions, `interface` for object shapes that may be extended.

### React Native
- Functional components only. Hooks only.
- Keep components small: one screen/component per file. Split when > ~200 lines.
- Never inline `StyleSheet.create` calls in render — define at module scope or memoize.
- Never mount a `Reanimated` value inside render without `useSharedValue`.
- All animations via Reanimated 3 worklets; no `Animated` API from core RN.
- Gestures via `react-native-gesture-handler`, not `PanResponder`.
- Images: prefer `expo-image` over the core `Image`.
- Lists: use `keyExtractor`, `getItemType` (FlashList), `estimatedItemSize`.

### Performance discipline
- Memoize expensive derived values with `useMemo`; memoize handlers passed deep with `useCallback`.
- Avoid anonymous inline functions in list item renderers.
- Use `React.memo` for adapter components that accept primitives.

### Platform handling
- Prefer cross-platform code. Use `Platform.select` only for true divergences (shadow vs elevation, keyboard behaviors).
- Use `SafeAreaView` / `useSafeAreaInsets()` on every screen.

### Forms
- `react-hook-form` + `zodResolver`.
- Each form field uses an adapter component with a `name` prop registered via `Controller` or a custom `RHFTextField`-style wrapper under `src/components/hook-form/`.
- Validation schemas live next to the screen/component that uses them.

### Errors and logging
- User-facing errors via `burnt` toast; log the full error to console in dev only.
- Never swallow a caught error without a visible side effect.
- Axios interceptor normalizes errors to `{ message, code, field? }`.

### Tests (when introduced in a later stage)
- Jest + `@testing-library/react-native`.
- Business logic (utils, hooks, reducers) covered; snapshot tests only for layout-critical screens.

---

## File layout expectations

```
src/
  components/
    mui/           — MUI-compatible adapters (Stage 1 core)
    custom/        — project-specific components that don't mirror MUI
    hook-form/     — RHF wrappers over mui adapters
  theme/
    core/          — palette, typography, shadows, spacing
    hooks/         — use-theme, use-responsive
  lib/             — axios, swr, storage, secure-storage
  hooks/           — cross-cutting RN hooks
  auth/            — context, providers, guards (ported from web)
  routes/
    paths.ts       — path constants (copied from web)
    hooks/         — wrappers over expo-router
  sections/        — per-feature screens, ported stage by stage
  utils/           — copied from web, no DOM dependencies
  types/           — shared types + module augmentations
  locales/         — i18n resources
```

---

## Commit protocol

- One coherent change per commit.
- Prefixes: `setup:`, `theme:`, `adapter:`, `auth:`, `screen:`, `layout:`, `plan:`, `fix:`, `deps:`, `refactor:`.
- Update `PROGRESS.md` in the same commit.
- If you touched the plan, commit plan edits **before** code that depends on them.

## When stuck

- Reread the plan section relevant to the current task.
- If the plan is ambiguous or wrong, propose an edit to the plan instead of guessing.
- If a package choice looks suspicious (no New Arch support, last update > 18 months ago), raise it before installing.

## When resuming after a session gap

1. `git log --oneline -20`
2. Read last updated section of `PROGRESS.md`.
3. Confirm current stage in the plan.
4. Resume from the first unchecked item.
