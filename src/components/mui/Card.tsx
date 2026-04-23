/**
 * `Card`, `CardContent`, `CardHeader`, `CardActions` — MUI-compatible drop-ins.
 *
 * MUI parity:
 *  - `Card`: `variant` ('elevation' → Paper 'elevated', 'outlined' → 'outlined').
 *    `raised` maps to higher Paper elevation. `sx`.
 *  - `CardContent`: children inside Paper `Card.Content`.
 *  - `CardHeader`: `title`, `subheader`, `avatar`, `action` → Paper `Card.Title`.
 *  - `CardActions`: children inside Paper `Card.Actions`.
 */

import { Card as PaperCard } from 'react-native-paper';

import type { SxProp } from './types';
import type { JSX, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

export type CardVariant = 'elevation' | 'outlined';

export type CardProps = {
  variant?: CardVariant;
  raised?: boolean;
  onClick?: () => void;
  onPress?: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
  children?: ReactNode;
};

export function Card({
  variant = 'elevation',
  raised,
  onClick,
  onPress,
  testID,
  style,
  sx,
  children,
}: CardProps): JSX.Element {
  const handlePress = onClick ?? onPress;
  if (variant === 'outlined') {
    return (
      <PaperCard mode="outlined" onPress={handlePress} testID={testID} style={[style, sx]}>
        {children}
      </PaperCard>
    );
  }
  return (
    <PaperCard
      mode="elevated"
      elevation={raised ? 4 : 1}
      onPress={handlePress}
      testID={testID}
      style={[style, sx]}
    >
      {children}
    </PaperCard>
  );
}

Card.displayName = 'Card';

// ----------------------------------------------------------------------

export type CardContentProps = {
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
  children?: ReactNode;
};

export function CardContent({ style, sx, children }: CardContentProps): JSX.Element {
  return <PaperCard.Content style={[style, sx]}>{children}</PaperCard.Content>;
}

CardContent.displayName = 'CardContent';

// ----------------------------------------------------------------------

export type CardHeaderProps = {
  title?: ReactNode;
  subheader?: ReactNode;
  avatar?: ReactNode;
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
};

export function CardHeader({
  title,
  subheader,
  avatar,
  action,
  style,
  sx,
}: CardHeaderProps): JSX.Element {
  return (
    <PaperCard.Title
      title={title as string | undefined}
      subtitle={subheader as string | undefined}
      left={avatar ? () => <>{avatar}</> : undefined}
      right={action ? () => <>{action}</> : undefined}
      style={[style, sx]}
    />
  );
}

CardHeader.displayName = 'CardHeader';

// ----------------------------------------------------------------------

export type CardActionsProps = {
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
  children?: ReactNode;
};

export function CardActions({ style, sx, children }: CardActionsProps): JSX.Element {
  return <PaperCard.Actions style={[style, sx]}>{children}</PaperCard.Actions>;
}

CardActions.displayName = 'CardActions';
