/**
 * `Iconify` — RN port of the web `src/components/iconify/Iconify` component.
 *
 * Web parity:
 *  - Same `IconifyName` type derived from the shared `icon-sets.ts`.
 *  - Same prop shape: `<Iconify icon="solar:pen-bold" width={20} color={...} />`.
 *
 * Implementation differs from web (divergence documented in CLAUDE.md):
 *  - Web uses `@iconify/react` which renders via `<svg>`; RN renders via
 *    `react-native-svg`'s `SvgXml` and pre-substitutes `currentColor` because
 *    `SvgXml` does not propagate the `color` CSS cascade.
 *  - No `sx` prop — supported style knob is `style`. Sections relying on
 *    `sx={{ color, width, ... }}` must use dedicated props.
 *
 * Offline-only: unknown icons log a dev warning and render nothing. Add the
 * body to `icon-sets.ts` (copied verbatim from the web repo) to register.
 */

import { useTheme } from 'src/theme';
import { memo, useMemo } from 'react';
import { SvgXml } from 'react-native-svg';

import allIcons from './icon-sets';

import type { JSX } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

export type IconifyName = keyof typeof allIcons;

export type IconifyProps = {
  icon: IconifyName;
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

// Carbon icons are authored on a 32×32 grid; the rest on 24×24.
function getViewBoxSize(icon: string): number {
  return icon.startsWith('carbon:') ? 32 : 24;
}

export const Iconify = memo(function Iconify({
  icon,
  width = 20,
  height,
  color,
  style,
  testID,
}: IconifyProps): JSX.Element | null {
  const { theme } = useTheme();
  const tint = color ?? theme.palette.text.primary;
  const entry = allIcons[icon] as { body: string } | undefined;

  const xml = useMemo(() => {
    if (!entry) return null;
    const viewBox = getViewBoxSize(icon);
    // SvgXml does not cascade `color`; replace `currentColor` tokens directly.
    const body = entry.body.replace(/currentColor/g, tint);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBox} ${viewBox}">${body}</svg>`;
  }, [entry, icon, tint]);

  if (!xml) {
    if (__DEV__) {
      console.warn(`[Iconify] unknown icon "${icon}" — add it to icon-sets.ts`);
    }
    return null;
  }

  return <SvgXml xml={xml} width={width} height={height ?? width} style={style} testID={testID} />;
});

Iconify.displayName = 'Iconify';
