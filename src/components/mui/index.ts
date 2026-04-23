/**
 * MUI-compatible adapter layer.
 *
 * Usage: `import { Button, Stack, Typography } from 'src/components/mui'`.
 * Prop names and values mirror `@mui/material` — see each component file for
 * the exact support matrix. Unsupported MUI props (e.g., `component`) are
 * intentionally omitted and NOT silently ignored.
 *
 * Progressively populated stage by stage — see PROGRESS.md.
 */

export { Box, type BoxProps } from './Box';
export { Stack, type StackProps, type StackDirection } from './Stack';
export { Typography, type TypographyProps } from './Typography';
export { Divider, type DividerProps } from './Divider';
export { Button, type ButtonProps, type ButtonVariant, type ButtonIconSource } from './Button';
export { IconButton, type IconButtonProps } from './IconButton';
export {
  TextField,
  type TextFieldProps,
  type TextFieldVariant,
  type TextFieldType,
} from './TextField';
export {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  type CardActionsProps,
  type CardContentProps,
  type CardHeaderProps,
  type CardProps,
  type CardVariant,
} from './Card';
export { CircularProgress, type CircularProgressProps } from './CircularProgress';
export { LinearProgress, type LinearProgressProps } from './LinearProgress';
export { Switch, type SwitchProps } from './Switch';
export { Checkbox, type CheckboxProps } from './Checkbox';
export { Radio, RadioGroup, type RadioProps, type RadioGroupProps } from './Radio';
export { Avatar, type AvatarProps, type AvatarVariant } from './Avatar';
export { Chip, type ChipProps } from './Chip';
export {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  type DialogActionsProps,
  type DialogContentProps,
  type DialogProps,
  type DialogTitleProps,
} from './Dialog';
export { Snackbar, type SnackbarAction, type SnackbarProps } from './Snackbar';
export { Tab, Tabs, type TabProps, type TabsProps } from './Tabs';
export {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  type AccordionDetailsProps,
  type AccordionProps,
  type AccordionSummaryProps,
} from './Accordion';
export { Menu, MenuItem, type MenuItemProps, type MenuProps } from './Menu';
export { Tooltip, type TooltipProps } from './Tooltip';
export { Badge, type BadgeProps } from './Badge';
export { Breadcrumbs, type BreadcrumbsProps } from './Breadcrumbs';
export { Skeleton, type SkeletonProps, type SkeletonVariant } from './Skeleton';
export { Slider, type SliderProps } from './Slider';
export { Autocomplete, type AutocompleteProps } from './Autocomplete';
export { DatePicker, type DatePickerProps } from './DatePicker';
export {
  DataGrid,
  type DataGridColumn,
  type DataGridProps,
  type DataGridSortModel,
  type SortDirection,
} from './DataGrid';

export type { SxProp, AdapterColor, AdapterSize, IconSource } from './types';
