/**
 * `Badge` — MUI-compatible drop-in.
 *
 * MUI parity:
 *  - `badgeContent`: number | string.
 *  - `children`: anchor element wrapped by the badge.
 *  - `color`: palette key (default `error`).
 *  - `max`: truncate `badgeContent` when numeric (default 99).
 *  - `invisible`: hide the badge pill.
 *  - `showZero`: show when badgeContent === 0 (default false).
 *  - `anchorOrigin`, `overlap`, `variant='dot'`: simplified — we position the
 *    pill at top-right. Dot variant NOT supported yet.
 *  - Paper's `<Badge>` is a standalone pill; we stack it absolutely over the
 *    child inside a relatively positioned wrapper.
 */

import { useTheme } from 'src/theme';
import { StyleSheet, View } from 'react-native';
import { Badge as PaperBadge } from 'react-native-paper';

import type { JSX, ReactNode } from 'react';
import type { SxProp, AdapterColor } from './types';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

const styles = StyleSheet.create({
  wrapper: { position: 'relative', alignSelf: 'flex-start' },
  pill: { position: 'absolute', top: -4, right: -4 },
});

// ----------------------------------------------------------------------

export type BadgeProps = {
  badgeContent?: number | string;
  color?: Exclude<AdapterColor, 'inherit'>;
  max?: number;
  invisible?: boolean;
  showZero?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
  children?: ReactNode;
};

function formatContent(content: number | string | undefined, max: number): string | undefined {
  if (content === undefined) return undefined;
  if (typeof content === 'string') return content;
  if (content > max) return `${max}+`;
  return String(content);
}

export function Badge({
  badgeContent,
  color = 'error',
  max = 99,
  invisible,
  showZero,
  testID,
  style,
  sx,
  children,
}: BadgeProps): JSX.Element {
  const { theme } = useTheme();

  const isZero = badgeContent === 0;
  const hidden = invisible || (isZero && !showZero) || badgeContent === undefined;
  const label = formatContent(badgeContent, max);

  return (
    <View style={[styles.wrapper, style, sx]} testID={testID}>
      {children}
      {!hidden ? (
        <PaperBadge
          visible
          style={[
            styles.pill,
            {
              backgroundColor: theme.palette[color].main,
              color: theme.palette[color].contrastText,
            },
          ]}
        >
          {label}
        </PaperBadge>
      ) : null}
    </View>
  );
}

Badge.displayName = 'Badge';
