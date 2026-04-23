---
name: mui-adapter-builder
description: Use when creating or extending a component in `src/components/mui/`. Ensures API compatibility with @mui/material so web sections port mechanically, and enforces theme-token-only styling.
---

# MUI Adapter Builder

## When to use
Triggered whenever a file is created or modified under `src/components/mui/`. Also applies to `src/components/hook-form/` when wrapping an adapter for react-hook-form.

## Why adapters exist
The web project (`G:/Work/show-ring`) uses `@mui/material` directly. This mobile project replicates MUI's **component names, prop names, and prop values** on top of `react-native-paper` + RN primitives so that section code can be copied with minimal edits. No rewriting section JSX.

## Hard requirements

### 1. API parity, not internal parity
- Export component with the same name as MUI: `Button`, `Stack`, `Typography`, etc.
- Accept the same prop names: `variant`, `color`, `size`, `disabled`, `fullWidth`, etc.
- Accept the same prop **values**: `variant="contained" | "outlined" | "text"` for Button, not renamed.
- Map `onClick` → internal `onPress`. (Sections written for web use `onClick`; do not ask them to change.)

### 2. Document deviations
- `sx` prop: accept only flat style objects (no media queries, no pseudo-selectors). Throw in dev if a nested selector is passed.
- `component` polymorphism: NOT supported. If passed, warn in dev.
- Mouse-only events (`onMouseEnter`, `onHover`): ignore silently.
- Add any new deviation to `src/components/mui/README.md`.

### 3. Theme-tokens-only styling
- Read colors via `useTheme().palette.*`, never hardcode hex.
- Read spacing via `sp(n)` helper (= `n * 8`).
- Read radii, typography, shadows from theme.
- Dark mode must work automatically — never branch on "dark" manually; use theme values.

### 4. Under-the-hood delegation
- Prefer `react-native-paper` components where available (Button, TextInput, Card, IconButton, Switch, Checkbox, Radio, Chip, Badge, Tooltip, Menu, Snackbar, ActivityIndicator, ProgressBar, List.Accordion, Divider, Avatar).
- For items without a Paper equivalent (Box, Stack, Typography, Breadcrumbs, Skeleton, Tabs pager-style, Autocomplete, DatePicker, DataGrid): build on RN primitives (View, Text, Pressable) + Reanimated + gesture-handler.
- Never re-implement gestures or animations from scratch.

### 5. TypeScript discipline
- Props interface named `<Component>Props`, exported.
- Extend `ViewProps` / `TextProps` where sensible, omitting incompatible keys.
- No `any`. For union prop values, use string literal unions that match MUI's type.

### 6. Boilerplate checklist
Every adapter file must:
- [ ] Define `Props` type with JSDoc per prop
- [ ] Use theme via hook, never direct palette import
- [ ] Define styles via `StyleSheet.create` at module scope OR memoize via `useMemo` when they depend on theme/props
- [ ] Set `displayName`
- [ ] Export named (and default when convenient)

### 7. When a Paper component slightly differs
If Paper's prop values don't match MUI's, remap in the adapter. Example:
```tsx
// MUI: variant="contained" | "outlined" | "text"
// Paper: mode="contained" | "outlined" | "text"
const paperMode = variant;           // happens to match
// but for color: MUI uses palette keys, Paper uses 'primary' | undefined
const paperButtonColor = color === 'primary' ? undefined : theme.palette[color]?.main;
```
Never expose Paper-specific prop names to consumers of the adapter.

### 8. Test before marking done
- Render in light and dark mode.
- Render in both iOS and Android simulators.
- Check the adapter is consumed by at least one sample screen.

## Anti-patterns (reject in review)
- Importing from `@mui/material` anywhere in mobile code.
- Hardcoded colors or pixel values.
- Inline `StyleSheet.create` inside render.
- `any` types, `@ts-ignore`, `@ts-expect-error`.
- Re-implementing gestures with `PanResponder` instead of gesture-handler.
- Adding a "maybe useful later" prop. YAGNI.
