/**
 * `Accordion`, `AccordionSummary`, `AccordionDetails` — MUI-compatible drop-ins.
 *
 * MUI parity:
 *  - `<Accordion expanded onChange>` with `<AccordionSummary>` title and
 *    `<AccordionDetails>` body children — ported mechanically.
 *  - Implementation: the child list is walked and the two slots (`Summary`,
 *    `Details`) are extracted. Render uses Paper `List.Accordion`.
 *  - `defaultExpanded`: supported.
 *  - `disabled`: supported.
 *  - `TransitionComponent`, `square`: NOT supported.
 */

import { StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { Children, isValidElement, useState } from 'react';

import type { SxProp } from './types';
import type { JSX, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

const styles = StyleSheet.create({
  disabled: { opacity: 0.5 },
});

// ----------------------------------------------------------------------

export type AccordionSummaryProps = { children?: ReactNode };

/** Marker: its children are rendered as the accordion's title. */
export function AccordionSummary({ children }: AccordionSummaryProps): JSX.Element {
  return <>{children}</>;
}

AccordionSummary.displayName = 'AccordionSummary';

// ----------------------------------------------------------------------

export type AccordionDetailsProps = { children?: ReactNode };

/** Marker: its children are rendered as the accordion's expanded body. */
export function AccordionDetails({ children }: AccordionDetailsProps): JSX.Element {
  return <>{children}</>;
}

AccordionDetails.displayName = 'AccordionDetails';

// ----------------------------------------------------------------------

export type AccordionProps = {
  expanded?: boolean;
  defaultExpanded?: boolean;
  onChange?: (expanded: boolean) => void;
  disabled?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
  children?: ReactNode;
};

export function Accordion({
  expanded,
  defaultExpanded,
  onChange,
  disabled,
  testID,
  style,
  sx,
  children,
}: AccordionProps): JSX.Element {
  const isControlled = expanded !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded ?? false);
  const open = isControlled ? expanded : internalExpanded;

  let summary: ReactNode = null;
  let details: ReactNode = null;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === AccordionSummary) summary = child;
    else if (child.type === AccordionDetails) details = child;
  });

  const handlePress = disabled
    ? undefined
    : (): void => {
        const next = !open;
        if (!isControlled) setInternalExpanded(next);
        onChange?.(next);
      };

  return (
    <List.Accordion
      title={summary}
      expanded={open}
      onPress={handlePress}
      style={[disabled ? styles.disabled : null, style, sx]}
      testID={testID}
    >
      {details}
    </List.Accordion>
  );
}

Accordion.displayName = 'Accordion';
