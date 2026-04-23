---
name: senior-rn-standards
description: Use on any code change. Enforces senior-level React Native code quality: performance, types, list virtualization, gesture handling, error flow, and dead-code discipline.
---

# Senior React Native Standards

This is the baseline for every file touched in the project.

## TypeScript
- `strict: true`. Never `any`. Never `@ts-ignore` / `@ts-expect-error`.
- Explicit return types on **exported** functions and React components.
- Use `type` for unions and intersections, `interface` for object shapes meant to be extended.
- Unused imports → delete. Unused params → prefix `_`.
- Generic components: constrain generics; never `<T extends any>`.
- Module augmentation lives in `src/types/` — don't inline it in feature code.

## React Native specifics
- Functional components + hooks only.
- One component or screen per file. Split when > ~200 logical lines.
- `StyleSheet.create` at module scope; memoize when styles depend on theme/props.
- Animations: **Reanimated 3** worklets only. No core RN `Animated`. No JS-thread tweens.
- Gestures: **react-native-gesture-handler** only. No `PanResponder`.
- Lists with > ~20 items or variable-size items: **`@shopify/flash-list`**. Provide `estimatedItemSize`, `keyExtractor`, `getItemType`.
- Images: prefer `expo-image` over RN `Image` (better caching, blurhash, placeholders).
- Keyboard: wrap forms in `KeyboardAvoidingView` on iOS. Use `inputAccessoryView` for multi-field forms.
- Safe areas: every top-level screen handles `useSafeAreaInsets()` or renders inside `SafeAreaView`.

## Performance discipline
- Derived values → `useMemo` when computation is non-trivial.
- Handlers passed deep into memoized children → `useCallback`.
- `React.memo` for adapter components accepting primitive-heavy props.
- Do not create new objects/arrays/functions inline inside `renderItem`.
- `useSharedValue` + `useAnimatedStyle` for animated props; never store Reanimated values in React state.

## Platform branching
- Default to cross-platform code.
- `Platform.select` or `Platform.OS` only for genuine platform differences (shadow vs elevation, hardware back, keyboard behavior, Haptics strength).

## Forms
- `react-hook-form` + `zodResolver`.
- Field components via `src/components/hook-form/` wrappers around the MUI adapter.
- Submission: `handleSubmit(async (data) => { ... })` — never try/catch silently.
- Server errors: map into `setError` per field or toast at form level.

## Data fetching
- SWR with keys stable and predictable: `['resource', id, filters]` as array.
- Mutations via SWR's `mutate` or optimistic updates. Revalidate after write.
- Axios instance from `src/lib/axios.ts` — never `fetch()` directly in app code.

## Error handling
- Never swallow. Every `catch` must emit a user-visible signal (toast/inline error) OR re-throw.
- Use `burnt.toast({ preset: 'error', title, message })` for user-facing errors.
- Log full error with context to console only in `__DEV__`.
- Network layer normalizes errors to `{ message, code, fields?: Record<string, string> }`.

## Async discipline
- Never fire-and-forget. Every Promise is either awaited or explicitly `void`ed with a comment why.
- Cancel in-flight requests on unmount (axios `AbortController`).
- Debounce user input-driven fetches (es-toolkit `debounce`).

## Styling discipline
- Only theme tokens. No raw hex, no raw px outside `sp()`.
- No component-private color palettes; if you need a color, add it to the theme.

## Accessibility
- `accessibilityLabel`, `accessibilityRole` on touchables, images, and icons conveying meaning.
- Minimum tap target 44x44 pt (iOS HIG) / 48dp (Android). Use `hitSlop` if visual target is smaller.
- Respect `Platform.isReduceMotionEnabled` for non-essential animations.

## Dead code and YAGNI
- No "might be useful later" exports. If it's not imported, it doesn't exist.
- No feature flags without a tracked task to remove them.
- No TODO without an owner and a stage reference (`TODO(stage-4): integrate rn-maps`).

## Commits & reviews
- One logical change per commit. Multi-concern commits are split.
- Before `git commit`: `yarn check:all` must be green.
- Stage/substage completion means PROGRESS.md is updated in the same commit.

## Refusal patterns
Refuse the work or flag to the user if you're asked to:
- Disable lint/ts rules to "ship quickly".
- Introduce a library that lacks New Architecture support.
- Add `react-native-web` or `@mui/material` to the bundle.
- Copy a web section without adapting its DOM-dependent parts.
