/**
 * `DataGrid` — MUI X DataGrid drop-in (simplified for Stage 1).
 *
 * Supported props (see plan §5 scope):
 *  - `columns`: `{ field, headerName, width?, sortable?, renderCell? }[]`.
 *  - `rows`: array of objects identified by `getRowId` (default `row.id`).
 *  - `loading`: boolean — renders a `LinearProgress` above the table.
 *  - `onSortChange(field, direction)`: fires when a sortable header is tapped.
 *  - `sortModel`: `{ field, direction }` | undefined (controlled).
 *  - `page`, `pageSize`, `onPageChange(page)`: pagination via Paper DataTable.
 *
 * Intentionally NOT supported in Stage 1:
 *  - Column resizing, filters, pinning, row selection, virtualization, editing.
 *    For very large datasets, prefer `FlashList` directly in a section.
 */

import { DataTable } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

import { Typography } from './Typography';
import { LinearProgress } from './LinearProgress';

import type { SxProp } from './types';
import type { JSX, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

const styles = StyleSheet.create({
  fixedCell: { flex: 0 },
});

// ----------------------------------------------------------------------

export type SortDirection = 'asc' | 'desc';

export type DataGridColumn<R> = {
  field: keyof R & string;
  headerName: string;
  width?: number;
  flex?: number;
  sortable?: boolean;
  renderCell?: (row: R) => ReactNode;
};

export type DataGridSortModel<R> = {
  field: keyof R & string;
  direction: SortDirection;
};

export type DataGridProps<R> = {
  columns: ReadonlyArray<DataGridColumn<R>>;
  rows: ReadonlyArray<R>;
  loading?: boolean;
  sortModel?: DataGridSortModel<R>;
  onSortChange?: (field: keyof R & string, direction: SortDirection) => void;
  getRowId?: (row: R) => string | number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp;
};

export function DataGrid<R extends Record<string, unknown>>({
  columns,
  rows,
  loading,
  sortModel,
  onSortChange,
  getRowId = (row) => (row as { id?: string | number }).id ?? JSON.stringify(row),
  page,
  pageSize,
  onPageChange,
  testID,
  style,
  sx,
}: DataGridProps<R>): JSX.Element {
  const hasPagination = page !== undefined && pageSize !== undefined;
  const totalPages = hasPagination ? Math.max(1, Math.ceil(rows.length / pageSize)) : 1;
  const pagedRows = hasPagination ? rows.slice(page * pageSize, (page + 1) * pageSize) : rows;

  return (
    <View style={[style, sx]} testID={testID}>
      {loading ? <LinearProgress variant="indeterminate" /> : null}
      <DataTable>
        <DataTable.Header>
          {columns.map((col) => {
            const sortedActive = sortModel?.field === col.field;
            const direction: SortDirection | undefined = sortedActive
              ? sortModel?.direction
              : undefined;
            return (
              <DataTable.Title
                key={col.field}
                sortDirection={
                  direction === 'asc'
                    ? 'ascending'
                    : direction === 'desc'
                      ? 'descending'
                      : undefined
                }
                onPress={
                  col.sortable
                    ? () => {
                        const next: SortDirection = direction === 'asc' ? 'desc' : 'asc';
                        onSortChange?.(col.field, next);
                      }
                    : undefined
                }
                style={
                  col.width ? [styles.fixedCell, { width: col.width }] : { flex: col.flex ?? 1 }
                }
              >
                {col.headerName}
              </DataTable.Title>
            );
          })}
        </DataTable.Header>

        {pagedRows.map((row) => (
          <DataTable.Row key={getRowId(row)}>
            {columns.map((col) => (
              <DataTable.Cell
                key={col.field}
                style={
                  col.width ? [styles.fixedCell, { width: col.width }] : { flex: col.flex ?? 1 }
                }
              >
                {col.renderCell ? (
                  col.renderCell(row)
                ) : (
                  <Typography variant="body2">{String(row[col.field] ?? '')}</Typography>
                )}
              </DataTable.Cell>
            ))}
          </DataTable.Row>
        ))}

        {hasPagination ? (
          <DataTable.Pagination
            page={page}
            numberOfPages={totalPages}
            onPageChange={(p) => onPageChange?.(p)}
            label={`${page * pageSize + 1}-${Math.min((page + 1) * pageSize, rows.length)} of ${rows.length}`}
          />
        ) : null}
      </DataTable>
    </View>
  );
}

DataGrid.displayName = 'DataGrid';
