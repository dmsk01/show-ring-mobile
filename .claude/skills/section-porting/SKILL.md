---
name: section-porting
description: Use when porting a section from `G:/Work/show-ring/src/sections/<name>/` into `show-ring-mobile`. Covers DOM cleanup, adapter substitution, form migration, and per-section checklist.
---

# Section Porting

## When to use
Any Stage 3+ task where a section folder is copied over from the web project.

## Source of truth
`G:/Work/show-ring/src/sections/<name>/` — copy JSX and logic from here. Do not re-invent behavior.

## Porting procedure (apply to every section)

### 1. Bring over verbatim files first
- Copy the whole folder into `src/sections/<name>/`.
- Do not change file names or structure.

### 2. Fix imports (mechanical)
Replace in the copied files:
- `@mui/material` → `src/components/mui`
- `@mui/icons-material` → equivalent from `@expo/vector-icons` or a custom icon file
- `next/link` → `<Link>` from `expo-router` (wrapped in `src/routes/hooks/` if needed)
- `next/navigation` → `src/routes/hooks/`
- `next/image` → `expo-image`'s `Image`
- direct `@iconify/react` → mapped to an icon from `@expo/vector-icons` or inlined SVG via `react-native-svg`

### 3. Strip DOM-only props
- `onMouseEnter`, `onMouseLeave`, `onHover` → delete
- `onClick` → leaves as-is (adapter translates); if on raw `<div>`, swap to `<Pressable>` with `onPress`
- `<div>` / `<span>` → replace with `<View>` / `<Text>` or appropriate adapter

### 4. Styling cleanup
- `sx` prop with media queries → split into `useResponsive()`-based conditional style
- CSS-in-JS template strings (`styled('div')` with raw CSS) → replace with `styled-components/native` or `StyleSheet.create`
- Remove `cursor`, `userSelect`, `:hover` — RN has no equivalent

### 5. Forms
- `react-hook-form` usage stays identical.
- Replace web RHF wrappers (`RHFTextField` from web) with mobile equivalents from `src/components/hook-form/`.
- Zod schemas copy 1:1.

### 6. Lists
- If the section renders > 20 rows or infinite scroll — switch to `FlashList`.
- Provide `estimatedItemSize` matching the real item height.

### 7. Missing adapter
If a needed MUI component is missing from `src/components/mui/`:
- STOP. Do not inline a one-off implementation in the section.
- Add it to `src/components/mui/` following the `mui-adapter-builder` skill.
- Update `PROGRESS.md` and the plan if the adapter addition belongs to a later stage.

### 8. External libs
For sections using a web-only dependency, switch to the mobile replacement listed in the plan §7 table. Create a thin wrapper at `src/components/<name>/` presenting the same API shape as the web component used to.

### 9. Validation
- `yarn tsc --noEmit` passes for touched files.
- `yarn lint` passes.
- Section renders on a throwaway screen in both light and dark modes, iOS and Android.

### 10. Documentation
For non-trivial sections, add a short note in `src/sections/<name>/README.md`:
- Which web libs were replaced and with what.
- Which features are dropped (e.g. hover tooltips) and why.
- Any upstream web code to keep in sync.

## Priority order (Stage 3+)
1. `overview` — dashboard presence is the app's front face.
2. `account` — needed for profile/settings flows.
3. `pricing`, `faqs`, `contact`, `about` — static, quick wins for coverage.
4. `error`, `maintenance`, `coming-soon` — pre-empt user-facing issues.

## Anti-patterns
- Reimplementing behavior from scratch when the web code has it.
- Inlining a "good enough" dropdown instead of extending Autocomplete adapter.
- Porting a section that depends on a Stage-4 lib before Stage 4 is done. Defer the section.
- Silently dropping a feature (e.g., hover preview) without documenting it in the section's README.
