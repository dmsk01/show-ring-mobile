/**
 * `Skeleton` — MUI-compatible drop-in.
 *
 * MUI parity:
 *  - `variant`: 'text' | 'rectangular' | 'rounded' | 'circular'.
 *  - `width`, `height`: number or percentage string.
 *  - `animation`: 'pulse' (default) — implemented via Reanimated loop.
 *    'wave' and `false` NOT supported yet.
 *  - Uses Reanimated 3 per the senior-level rule "All animations via Reanimated".
 */

import { useEffect } from 'react';
import { useTheme, varAlpha } from 'src/theme';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import type { JSX } from 'react';
import type { SxProp } from './types';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

export type SkeletonVariant = 'text' | 'rectangular' | 'rounded' | 'circular';

export type SkeletonProps = {
  variant?: SkeletonVariant;
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  animation?: 'pulse' | false;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
};

export function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  testID,
  style,
  sx,
}: SkeletonProps): JSX.Element {
  const { theme } = useTheme();
  const pulse = useSharedValue(0.4);

  useEffect(() => {
    if (animation !== 'pulse') return;
    pulse.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    return () => {
      cancelAnimation(pulse);
    };
  }, [animation, pulse]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  const resolvedWidth = width ?? (variant === 'circular' ? 40 : '100%');
  const resolvedHeight =
    height ??
    (variant === 'text'
      ? Math.round(theme.typography.body1.fontSize * 1.2)
      : variant === 'circular'
        ? 40
        : 16);

  const borderRadius =
    variant === 'circular'
      ? typeof resolvedHeight === 'number'
        ? resolvedHeight / 2
        : 999
      : variant === 'rounded' || variant === 'text'
        ? theme.spacing(0.5)
        : 0;

  return (
    <Animated.View
      testID={testID}
      style={[
        {
          width: resolvedWidth,
          height: resolvedHeight,
          borderRadius,
          backgroundColor: varAlpha(theme.palette.grey['500Channel'], 0.16),
        },
        animatedStyle,
        style,
        sx,
      ]}
    />
  );
}

Skeleton.displayName = 'Skeleton';
