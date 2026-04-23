---
name: expo-router-screens
description: Use when creating or modifying files under `app/` (Expo Router screens and layouts). Ensures structure mirrors Next.js web routes and conventions for groups, guards, and deep links are followed.
---

# Expo Router Screens

## When to use
Any file under `app/**` in `show-ring-mobile`.

## Mental model
The web project uses Next.js `app/` directory. Expo Router mirrors this: file path = route. Groups in parentheses `(auth)` do not affect URL, they scope layouts. `_layout.tsx` provides a shared wrapper. Dynamic segments are `[param].tsx`. Catch-all is `[...rest].tsx`.

## Structure expected

```
app/
  _layout.tsx               # root: providers stack, fonts
  +not-found.tsx
  (auth)/
    _layout.tsx             # Stack with no header, fade transition
    sign-in.tsx
    sign-up.tsx
    forgot-password.tsx
    reset-password.tsx
  (dashboard)/
    _layout.tsx             # Tabs (bottom nav)
    index.tsx               # Overview
    settings.tsx
    account/
      _layout.tsx
      profile.tsx
      security.tsx
  (modal)/                  # Expo Router supports modal presentation via Stack options
    ...
```

## Rules

### 1. One screen per file
- Split modal/inner components into `src/sections/<area>/` or `src/components/custom/`.
- The `app/**/*.tsx` files should be thin: load data, render a section component, handle navigation actions.

### 2. Provider order in root layout
```
<SafeAreaProvider>
  <GestureHandlerRootView>
    <PaperProvider theme={paperTheme}>
      <ThemeProvider>
        <LocalizationProvider>
          <SettingsProvider>
            <AuthProvider>
              <SWRConfig>
                <Slot />
              </SWRConfig>
            </AuthProvider>
          </SettingsProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </PaperProvider>
  </GestureHandlerRootView>
</SafeAreaProvider>
```
`GestureHandlerRootView` must be above any gesture-using component. `PaperProvider` must own the theme that Paper reads, but app uses `useTheme()` from `src/theme/hooks/use-theme` — ThemeProvider wraps PaperProvider so both stay in sync.

### 3. Guards
- `<AuthGuard>` and `<GuestGuard>` wrap screens or group layouts.
- Use `<Redirect href="/(auth)/sign-in" />` for unauthenticated navigation.
- Never call `router.replace` during render — always from an effect or event.

### 4. Navigation hooks
- Import `useRouter`, `usePathname`, `useSearchParams`, `useParams` from **`src/routes/hooks/`**, never directly from `expo-router`.
- These wrappers present an API close to Next.js `useRouter` so section code remains portable.

### 5. Screen options
- Define via `<Stack.Screen options={{...}} />` in the layout, not via per-screen side effects.
- Title: use `t(...)` from i18n.
- Hide back button for root tabs; show for nested stacks.
- Use `headerLargeTitle` on iOS where it matches the web visual rhythm.

### 6. Deep linking
- Declare scheme in `app.json` (`"scheme": "showring"`).
- Associated domains for HTTPS links (Apple) and intent filters (Android) added under `ios.associatedDomains` and `android.intentFilters`.
- Password reset / email verification routes must be reachable via both `showring://` and `https://<domain>/*` URLs.

### 7. Performance
- Use `lazy: true` on tab screens that don't need to mount upfront.
- Avoid running data fetching in `_layout.tsx`; push it into individual screens or centralized SWR keys.
- Use `expo-router`'s `useFocusEffect` (from `expo-router` / `@react-navigation/native`) to re-fetch on screen focus only when truly needed.

### 8. Linking to external targets
- `expo-linking.openURL(url)` for external HTTP, deep links, tel:, mailto:.
- Never use `window.open` — it doesn't exist.

## Anti-patterns
- Putting JSX over 100 lines inside `app/**/*.tsx`. Extract to a section component.
- Directly importing `expo-router` hooks in sections/components — always go through `src/routes/hooks/`.
- Mutating navigation state from inside `render()`.
- Adding new route groups without updating `src/routes/paths.ts`.
