/**
 * `Breadcrumbs` — MUI-compatible drop-in.
 *
 * MUI parity:
 *  - `separator`: ReactNode (default: '/').
 *  - `children`: array of crumb elements. Rendered in a row with separators
 *    inserted between items.
 *  - `maxItems`, `itemsBeforeCollapse`, `itemsAfterCollapse`: NOT supported
 *    (YAGNI for mobile — vertical stack is a better pattern on tight widths).
 */

import { useTheme } from 'src/theme';
import { StyleSheet, View } from 'react-native';
import { Children, Fragment, isValidElement } from 'react';

import { Typography } from './Typography';

import type { SxProp } from './types';
import type { JSX, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  separator: { opacity: 0.6 },
});

// ----------------------------------------------------------------------

export type BreadcrumbsProps = {
  separator?: ReactNode;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
  children?: ReactNode;
};

export function Breadcrumbs({
  separator = '/',
  testID,
  style,
  sx,
  children,
}: BreadcrumbsProps): JSX.Element {
  const { theme } = useTheme();
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <View style={[styles.row, { gap: theme.spacing(1) }, style, sx]} testID={testID}>
      {items.map((item, i) => (
        <Fragment key={i}>
          {item}
          {i < items.length - 1 ? (
            <Typography variant="body2" color="inherit" style={styles.separator}>
              {separator}
            </Typography>
          ) : null}
        </Fragment>
      ))}
    </View>
  );
}

Breadcrumbs.displayName = 'Breadcrumbs';
