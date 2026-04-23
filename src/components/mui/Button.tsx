/**
 * `Button` — MUI-compatible drop-in.
 *
 * MUI parity:
 *  - `variant`: 'contained' | 'outlined' | 'text' | 'soft' (soft = minimal-kit extension).
 *  - `color`: palette key or 'inherit' (maps to `text.primary`).
 *  - `size`: 'small' | 'medium' | 'large'.
 *  - `disabled`, `loading`, `fullWidth` — same semantics as MUI.
 *  - `startIcon` / `endIcon`: accept Paper's `IconSource` (icon name, component or render fn)
 *    instead of MUI's `ReactNode`. Documented deviation — avoids dragging MUI icon primitives.
 *    Passing both at the same time is unsupported; startIcon wins (YAGNI, add when needed).
 *  - `onClick` aliased to `onPress`; both are accepted.
 *  - `sx`: flat RN style object merged after `style`.
 *  - `component`: NOT supported — RN has no polymorphic rendering.
 *
 * Implementation notes:
 *  - Outlined variant is built on Paper's `text` mode with an explicit border, so the border
 *    color matches the MUI palette color (Paper's own outlined mode hardcodes MD3 outline).
 *  - Soft variant is Paper's `contained` mode with a translucent background derived from
 *    `palette[color].mainChannel × opacity.soft.bg`, matching the web minimal-kit recipe.
 */

import { useMemo } from 'react';
import { useTheme, varAlpha } from 'src/theme';
import { Button as PaperButton } from 'react-native-paper';

import type { ComponentProps, JSX, ReactNode } from 'react';
import type { SxProp, AdapterColor, AdapterSize } from './types';
import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

export type ButtonVariant = 'contained' | 'outlined' | 'text' | 'soft';

type PaperButtonProps = ComponentProps<typeof PaperButton>;
export type ButtonIconSource = NonNullable<PaperButtonProps['icon']>;

export type ButtonProps = {
  variant?: ButtonVariant;
  color?: AdapterColor;
  size?: AdapterSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  startIcon?: ButtonIconSource;
  endIcon?: ButtonIconSource;
  /** MUI alias — forwarded as `onPress`. If both are provided, `onClick` wins. */
  onClick?: (event: GestureResponderEvent) => void;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  sx?: SxProp;
  children: ReactNode;
};

// ----------------------------------------------------------------------

/** Paper `mode` under the hood for each MUI variant. */
const PAPER_MODE: Record<ButtonVariant, PaperButtonProps['mode']> = {
  contained: 'contained',
  outlined: 'text', // border drawn by us so palette color applies
  text: 'text',
  soft: 'contained',
};

/** Explicit heights for MUI sizes. `small` relies on Paper's `compact`. */
const SIZE_HEIGHT: Record<AdapterSize, number | undefined> = {
  small: undefined,
  medium: undefined,
  large: 48,
};

// ----------------------------------------------------------------------

export function Button({
  variant = 'text',
  color = 'primary',
  size = 'medium',
  disabled,
  loading,
  fullWidth,
  startIcon,
  endIcon,
  onClick,
  onPress,
  onLongPress,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  contentStyle,
  sx,
  children,
}: ButtonProps): JSX.Element {
  const { theme } = useTheme();

  const { buttonColor, textColor, borderColor } = useMemo(() => {
    const palette = color === 'inherit' ? null : theme.palette[color];
    const inheritText = theme.palette.text.primary;
    const inheritChannel = theme.palette.text.primaryChannel;

    switch (variant) {
      case 'contained':
        return palette
          ? {
              buttonColor: palette.main,
              textColor: palette.contrastText,
              borderColor: undefined as string | undefined,
            }
          : {
              buttonColor: theme.palette.grey['800'],
              textColor: theme.palette.common.white,
              borderColor: undefined as string | undefined,
            };
      case 'outlined':
        return {
          buttonColor: 'transparent',
          textColor: palette ? palette.main : inheritText,
          borderColor: varAlpha(
            palette ? palette.mainChannel : inheritChannel,
            theme.opacity.outlined.border
          ),
        };
      case 'soft':
        return {
          buttonColor: varAlpha(
            palette ? palette.mainChannel : inheritChannel,
            theme.opacity.soft.bg
          ),
          textColor: palette ? palette.dark : inheritText,
          borderColor: undefined as string | undefined,
        };
      case 'text':
      default:
        return {
          buttonColor: 'transparent',
          textColor: palette ? palette.main : inheritText,
          borderColor: undefined as string | undefined,
        };
    }
  }, [variant, color, theme]);

  const wrapperStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      fullWidth ? { alignSelf: 'stretch' } : null,
      borderColor ? { borderColor, borderWidth: 1 } : null,
      style,
      sx,
    ],
    [fullWidth, borderColor, style, sx]
  );

  const mergedContentStyle = useMemo<StyleProp<ViewStyle>>(() => {
    const explicitHeight = SIZE_HEIGHT[size];
    return [
      explicitHeight !== undefined ? { height: explicitHeight } : null,
      endIcon && !startIcon ? ({ flexDirection: 'row-reverse' } as const) : null,
      contentStyle,
    ];
  }, [size, startIcon, endIcon, contentStyle]);

  return (
    <PaperButton
      mode={PAPER_MODE[variant]}
      compact={size === 'small'}
      disabled={disabled}
      loading={loading}
      buttonColor={buttonColor}
      textColor={textColor}
      icon={startIcon ?? endIcon}
      onPress={onClick ?? onPress}
      onLongPress={onLongPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      testID={testID}
      style={wrapperStyle}
      contentStyle={mergedContentStyle}
    >
      {children}
    </PaperButton>
  );
}

Button.displayName = 'Button';
