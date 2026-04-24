/**
 * `BottomNavigation` + `BottomNavigationAction` — MUI-compatible drop-ins.
 *
 * MUI parity:
 *  - `BottomNavigation`: `value`, `onChange(value)`, `showLabels?`, `children`.
 *  - `BottomNavigationAction`: `value`, `label?`, `icon?`.
 *  - `color`: palette key — tints the active icon + label (default `primary`).
 *  - `showLabels` (default: MUI hides label when inactive). Matches MUI behavior.
 *
 * This is the *styled* variant — a plain horizontal row inside a section. For
 * the main app shell tabs (auth-gated navigation) we use expo-router's
 * `<Tabs>` (see `app/(app)/_layout.tsx`); the two are complementary.
 *
 * Implementation follows the Tabs adapter pattern: `BottomNavigationAction`
 * is a marker — metadata is read via `React.Children.forEach` and rendered as
 * a row of `TouchableRipple`s. Prevents drift from MUI's declarative API
 * without pulling in `react-native-tab-view`.
 */

import { useTheme } from 'src/theme';
import { StyleSheet, View } from 'react-native';
import { Children, isValidElement, useMemo } from 'react';
import { Icon, TouchableRipple } from 'react-native-paper';

import { Typography } from './Typography';

import type { JSX, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { IconSource, SxProp, AdapterColor } from './types';

// ----------------------------------------------------------------------

const BAR_HEIGHT = 56;
const ICON_SIZE = 24;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', height: BAR_HEIGHT, borderTopWidth: StyleSheet.hairlineWidth },
  action: { flex: 1 },
  actionInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { marginTop: 2 },
  disabled: { opacity: 0.5 },
});

// ----------------------------------------------------------------------

export type BottomNavigationActionProps = {
  value: string;
  label?: ReactNode;
  icon?: IconSource;
  disabled?: boolean;
};

/** Marker component — renders nothing. Metadata read by `BottomNavigation`. */
export function BottomNavigationAction(_props: BottomNavigationActionProps): null {
  return null;
}

BottomNavigationAction.displayName = 'BottomNavigationAction';

// ----------------------------------------------------------------------

export type BottomNavigationProps = {
  value: string;
  onChange: (value: string) => void;
  showLabels?: boolean;
  color?: Exclude<AdapterColor, 'inherit'>;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
  children?: ReactNode;
};

type Entry = { value: string; label?: ReactNode; icon?: IconSource; disabled?: boolean };

export function BottomNavigation({
  value,
  onChange,
  showLabels = false,
  color = 'primary',
  testID,
  style,
  sx,
  children,
}: BottomNavigationProps): JSX.Element {
  const { theme } = useTheme();

  const items: Entry[] = useMemo(() => {
    const entries: Entry[] = [];
    Children.forEach(children, (child) => {
      if (!isValidElement<BottomNavigationActionProps>(child)) return;
      if (child.type !== BottomNavigationAction) return;
      entries.push({
        value: child.props.value,
        label: child.props.label,
        icon: child.props.icon,
        disabled: child.props.disabled,
      });
    });
    return entries;
  }, [children]);

  const activeTint = theme.palette[color].main;
  const inactiveTint = theme.palette.text.secondary;

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: theme.palette.background.paper,
          borderTopColor: theme.palette.divider,
        },
        style,
        sx,
      ]}
      testID={testID}
      accessibilityRole="tablist"
    >
      {items.map((item) => {
        const active = item.value === value;
        const tint = active ? activeTint : inactiveTint;
        const labelVisible = showLabels || active;

        return (
          <TouchableRipple
            key={item.value}
            onPress={item.disabled ? undefined : () => onChange(item.value)}
            disabled={item.disabled}
            style={[styles.action, item.disabled ? styles.disabled : null]}
            accessibilityRole="tab"
            accessibilityState={{ selected: active, disabled: item.disabled }}
          >
            <View style={styles.actionInner}>
              {item.icon !== undefined ? (
                <Icon source={item.icon} size={ICON_SIZE} color={tint} />
              ) : null}
              {labelVisible && item.label != null ? (
                <Typography variant="caption" style={[styles.label, { color: tint }]} noWrap>
                  {item.label}
                </Typography>
              ) : null}
            </View>
          </TouchableRipple>
        );
      })}
    </View>
  );
}

BottomNavigation.displayName = 'BottomNavigation';
