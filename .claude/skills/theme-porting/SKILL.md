---
name: theme-porting
description: Use when porting theme tokens (palette, typography, shadows, spacing, breakpoints) from the web project at `G:/Work/show-ring/src/theme/` to this mobile project. Enforces exact color/typography parity and correct shadow translation.
---

# Theme Porting

## When to use
Any work on `src/theme/**` in `show-ring-mobile`. Also when modifying components that must stay visually identical to the web counterpart.

## Source of truth
`G:/Work/show-ring/src/theme/` — this is authoritative. When in doubt, re-read the web source; do not paraphrase from memory.

## Rules

### Palette
- Copy `palette.ts` **verbatim**. Colors, keys, structure — identical.
- Do not redefine grays or introduce new tokens. If a component needs a color that isn't in the palette, the palette is wrong — update it in both web and mobile, not locally.

### Typography
- Preserve `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing` values 1:1.
- **Override only** `fontFamily`: web uses CSS `@fontsource-variable/public-sans` etc.; mobile uses RN-registered family names like `"PublicSans-Regular"`, `"PublicSans-SemiBold"`, etc.
- Font weight in RN requires a separate font file per weight. When mapping `fontWeight: 600`, the `fontFamily` must be `"PublicSans-SemiBold"`. Build a helper `resolveFont(weight)`.
- Variable fonts are not reliably supported across platforms; ship discrete weight files only.

### Shadows
MUI provides 25 levels of `box-shadow`. RN uses:
- iOS: `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`
- Android: `elevation` (0-24)

Implement `muiShadowToRN(level: number): ShadowStyle`:
- Map `level` directly to `elevation` on Android.
- For iOS, interpolate offset/opacity/radius so visual weight matches the web output. Use the web `box-shadow` CSS at the same level as a reference when eyeballing (iOS requires manual tuning).
- Keep `shadowColor` aligned with `palette.grey[900]` to match web `rgba(0,0,0,X)`.

### Spacing
- Single helper: `const sp = (n: number) => n * 8`.
- Adapter components translate `spacing={2}` → `sp(2) = 16`.

### Breakpoints
- Copy values from web (`xs, sm, md, lg, xl`).
- Expose via `useResponsive(op: 'up' | 'down' | 'between', key: BreakpointKey)` that reads `useWindowDimensions()`.

### Dark mode
- `ThemeProvider` holds `mode: 'light' | 'dark'` in React state persisted to MMKV.
- On mode change, emit new merged theme; all adapter components re-render automatically via context.
- No `prefers-color-scheme` media query — use `useColorScheme()` from RN for the initial value only.

## Validation
- Render a "ThemeMatrix" debug screen during Stage 1.2 (kept under `app/(dev)/theme-matrix.tsx`, stripped in production via Expo Router conditional layouts if needed) that shows every color/token/typography preset side-by-side. Compare screenshot-to-screenshot with web theme playground.
- Run on both iOS and Android — shadows and fonts render differently.

## Anti-patterns
- Hardcoding colors inside `create-theme.ts`.
- Using CSS values like `box-shadow: '0 4px 8px ...'` strings.
- Using `rem` / `em` — RN doesn't support them.
- Forgetting to register a font weight → `fontWeight` silently ignored on Android.
