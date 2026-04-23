/**
 * `Tabs` + `Tab` — MUI-compatible drop-ins.
 *
 * MUI parity:
 *  - `Tabs`: `value`, `onChange(value)`, `children` (list of `Tab`).
 *  - `Tab`: `value`, `label`.
 *  - `variant`, `orientation`, `scrollButtons`, `indicatorColor`: simplified.
 *    Always renders a horizontal row with an animated underline under the
 *    active tab, tinted with the adapter `textColor`.
 *  - `color` palette key supported for the indicator + active label.
 *
 * Implementation: `Tab` is a pure marker — it is never rendered directly. `Tabs`
 * extracts its metadata via `React.Children.forEach` and renders a custom row
 * of `TouchableRipple`s. This keeps the API identical to MUI's declarative style
 * while avoiding `react-native-tab-view` (extra dep for MVP).
 */

import { useTheme } from 'src/theme';
import { StyleSheet, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { Children, isValidElement, useMemo } from 'react';

import { Typography } from './Typography';

import type { JSX, ReactNode } from 'react';
import type { SxProp, AdapterColor } from './types';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

const TRANSPARENT = 'transparent';

const styles = StyleSheet.create({
  row: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { borderBottomWidth: 2 },
  disabled: { opacity: 0.5 },
});

// ----------------------------------------------------------------------

export type TabProps = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

/** Marker component — renders nothing. Metadata read by `Tabs`. */
export function Tab(_props: TabProps): null {
  return null;
}

Tab.displayName = 'Tab';

// ----------------------------------------------------------------------

export type TabsProps = {
  value: string;
  onChange: (value: string) => void;
  color?: Exclude<AdapterColor, 'inherit'>;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
  children?: ReactNode;
};

type TabEntry = { value: string; label: ReactNode; disabled?: boolean };

export function Tabs({
  value,
  onChange,
  color = 'primary',
  testID,
  style,
  sx,
  children,
}: TabsProps): JSX.Element {
  const { theme } = useTheme();

  const tabs: TabEntry[] = useMemo(() => {
    const entries: TabEntry[] = [];
    Children.forEach(children, (child) => {
      if (!isValidElement<TabProps>(child)) return;
      if (child.type !== Tab) return;
      entries.push({
        value: child.props.value,
        label: child.props.label,
        disabled: child.props.disabled,
      });
    });
    return entries;
  }, [children]);

  const indicator = theme.palette[color].main;

  return (
    <View
      style={[styles.row, { borderBottomColor: theme.palette.divider }, style, sx]}
      testID={testID}
    >
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <TouchableRipple
            key={t.value}
            onPress={() => onChange(t.value)}
            disabled={t.disabled}
            style={[
              styles.tab,
              {
                paddingVertical: theme.spacing(1.5),
                paddingHorizontal: theme.spacing(2),
                borderBottomColor: active ? indicator : TRANSPARENT,
              },
            ]}
          >
            <Typography
              variant="button"
              color={active ? color : 'inherit'}
              style={t.disabled ? styles.disabled : undefined}
            >
              {t.label}
            </Typography>
          </TouchableRipple>
        );
      })}
    </View>
  );
}

Tabs.displayName = 'Tabs';
