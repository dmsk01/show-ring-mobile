/**
 * `Pagination` — MUI-compatible drop-in.
 *
 * MUI parity:
 *  - `count`: total page count (>= 0).
 *  - `page`: currently selected page (1-based). Controlled only — no default.
 *  - `onChange(page)`: fires when a page is picked. MUI's signature is
 *    `(event, page)`; we drop the event for parity with the rest of the
 *    adapter layer (section code rarely uses it).
 *  - `siblingCount` (default 1), `boundaryCount` (default 1): same algorithm
 *    as MUI `usePagination` — produces `first … page-sib … page … page+sib … last`.
 *  - `size`: 'small' | 'medium' | 'large' → 28 / 36 / 44 px hit target.
 *  - `shape`: 'circular' (default) | 'rounded'.
 *  - `color`: palette key — tints the active page + arrow icons.
 *  - `showFirstButton` / `showLastButton`: default false.
 *  - `hidePrevButton` / `hideNextButton`: default false.
 *  - `disabled`: disables every item.
 *
 * Intentionally NOT supported:
 *  - `variant='outlined'/'text'` — only filled-active / text-inactive.
 *  - `renderItem` slot — YAGNI until a section needs custom item chrome.
 *  - RTL — Stage 7 (MUI RTL is broad, handle separately via I18nManager).
 */

import { useMemo } from 'react';
import { useTheme } from 'src/theme';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';

import { Typography } from './Typography';

import type { JSX } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SxProp, AdapterColor, AdapterSize } from './types';

// ----------------------------------------------------------------------

export type PaginationShape = 'circular' | 'rounded';

type PageItem =
  | { kind: 'page'; page: number }
  | { kind: 'ellipsis'; key: 'start' | 'end' }
  | { kind: 'first' }
  | { kind: 'previous' }
  | { kind: 'next' }
  | { kind: 'last' };

export type PaginationProps = {
  count: number;
  page: number;
  onChange: (page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
  size?: AdapterSize;
  shape?: PaginationShape;
  color?: Exclude<AdapterColor, 'inherit'>;
  showFirstButton?: boolean;
  showLastButton?: boolean;
  hidePrevButton?: boolean;
  hideNextButton?: boolean;
  disabled?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
};

const SIZE_PX: Record<AdapterSize, number> = {
  small: 28,
  medium: 36,
  large: 44,
};

const ICON_PX: Record<AdapterSize, number> = {
  small: 16,
  medium: 20,
  large: 24,
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  item: { alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.5 },
});

// ----------------------------------------------------------------------

function range(start: number, end: number): number[] {
  const out: number[] = [];
  for (let n = start; n <= end; n += 1) out.push(n);
  return out;
}

/**
 * Replica of MUI's `usePagination` item-building algorithm (simplified to
 * return our discriminated-union items). Produces the `[first, ellipsis, ...,
 * last]` sequence expected by MUI's Pagination renderer.
 */
function buildItems(
  count: number,
  page: number,
  siblingCount: number,
  boundaryCount: number,
  showFirstButton: boolean,
  showLastButton: boolean,
  hidePrevButton: boolean,
  hideNextButton: boolean
): PageItem[] {
  if (count <= 0) return [];

  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0]! - 2 : count - 1
  );

  const pageNumbers: (number | 'start-ellipsis' | 'end-ellipsis')[] = [
    ...startPages,
    ...(siblingsStart > boundaryCount + 2
      ? (['start-ellipsis'] as const)
      : boundaryCount + 1 < count - boundaryCount
        ? ([boundaryCount + 1] as const)
        : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < count - boundaryCount - 1
      ? (['end-ellipsis'] as const)
      : count - boundaryCount > boundaryCount
        ? ([count - boundaryCount] as const)
        : []),
    ...endPages,
  ];

  const items: PageItem[] = [];
  if (showFirstButton) items.push({ kind: 'first' });
  if (!hidePrevButton) items.push({ kind: 'previous' });
  for (const entry of pageNumbers) {
    if (entry === 'start-ellipsis') items.push({ kind: 'ellipsis', key: 'start' });
    else if (entry === 'end-ellipsis') items.push({ kind: 'ellipsis', key: 'end' });
    else items.push({ kind: 'page', page: entry });
  }
  if (!hideNextButton) items.push({ kind: 'next' });
  if (showLastButton) items.push({ kind: 'last' });
  return items;
}

// ----------------------------------------------------------------------

export function Pagination({
  count,
  page,
  onChange,
  siblingCount = 1,
  boundaryCount = 1,
  size = 'medium',
  shape = 'circular',
  color = 'primary',
  showFirstButton = false,
  showLastButton = false,
  hidePrevButton = false,
  hideNextButton = false,
  disabled,
  testID,
  style,
  sx,
}: PaginationProps): JSX.Element {
  const { theme } = useTheme();

  const items = useMemo(
    () =>
      buildItems(
        count,
        page,
        siblingCount,
        boundaryCount,
        showFirstButton,
        showLastButton,
        hidePrevButton,
        hideNextButton
      ),
    [
      count,
      page,
      siblingCount,
      boundaryCount,
      showFirstButton,
      showLastButton,
      hidePrevButton,
      hideNextButton,
    ]
  );

  const dim = SIZE_PX[size];
  const iconSize = ICON_PX[size];
  const radius = shape === 'circular' ? dim / 2 : 6;
  const activeBg = theme.palette[color].main;
  const activeFg = theme.palette[color].contrastText;
  const iconFg = disabled ? theme.palette.action.disabled : theme.palette.text.primary;

  const handlePress = (target: number): void => {
    if (disabled) return;
    const clamped = Math.max(1, Math.min(count, target));
    if (clamped !== page) onChange(clamped);
  };

  return (
    <View style={[styles.row, style, sx]} testID={testID}>
      {items.map((item, index) => {
        const key = `${item.kind}:${
          item.kind === 'page' ? item.page : item.kind === 'ellipsis' ? item.key : 'btn'
        }:${index}`;

        if (item.kind === 'ellipsis') {
          return (
            <View
              key={key}
              style={[styles.item, { width: dim, height: dim }]}
              accessibilityElementsHidden
            >
              <Typography variant="body2" color="inherit">
                …
              </Typography>
            </View>
          );
        }

        const isPage = item.kind === 'page';
        const isActive = isPage && item.page === page;
        const itemDisabled =
          disabled ||
          (item.kind === 'previous' && page <= 1) ||
          (item.kind === 'first' && page <= 1) ||
          (item.kind === 'next' && page >= count) ||
          (item.kind === 'last' && page >= count);

        const onPress = (): void => {
          switch (item.kind) {
            case 'page':
              handlePress(item.page);
              return;
            case 'first':
              handlePress(1);
              return;
            case 'previous':
              handlePress(page - 1);
              return;
            case 'next':
              handlePress(page + 1);
              return;
            case 'last':
              handlePress(count);
          }
        };

        const iconName =
          item.kind === 'first'
            ? 'first-page'
            : item.kind === 'previous'
              ? 'chevron-left'
              : item.kind === 'next'
                ? 'chevron-right'
                : item.kind === 'last'
                  ? 'last-page'
                  : null;

        return (
          <TouchableRipple
            key={key}
            onPress={itemDisabled ? undefined : onPress}
            disabled={itemDisabled}
            borderless
            style={[
              styles.item,
              { width: dim, height: dim, borderRadius: radius },
              isActive ? { backgroundColor: activeBg } : null,
              itemDisabled ? styles.disabled : null,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive, disabled: itemDisabled }}
            accessibilityLabel={
              item.kind === 'page'
                ? `Page ${item.page}`
                : item.kind === 'first'
                  ? 'First page'
                  : item.kind === 'previous'
                    ? 'Previous page'
                    : item.kind === 'next'
                      ? 'Next page'
                      : 'Last page'
            }
          >
            {isPage ? (
              <Typography
                variant="body2"
                style={{ color: isActive ? activeFg : theme.palette.text.primary }}
              >
                {item.page}
              </Typography>
            ) : (
              <MaterialIcons name={iconName ?? 'chevron-right'} size={iconSize} color={iconFg} />
            )}
          </TouchableRipple>
        );
      })}
    </View>
  );
}

Pagination.displayName = 'Pagination';
