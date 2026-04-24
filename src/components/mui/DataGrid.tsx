/**
 * `DataGrid` — MUI X DataGrid drop-in (basic display, Stage 2 scope).
 *
 * Supported props:
 *  - `columns`: `{ field, headerName, width?, flex?, sortable?, renderCell? }[]`.
 *  - `rows`: array of objects identified by `getRowId` (default `row.id`).
 *  - `loading`: boolean — renders a `LinearProgress` above the table.
 *  - Sort: `sortModel` (controlled) + `onSortChange(field, direction)`.
 *  - Pagination: `page`, `pageSize`, `onPageChange(page)` via Paper DataTable.
 *  - Selection: `checkboxSelection`, `rowSelectionModel` (controlled array of
 *    row IDs), `onRowSelectionModelChange(model)`. Header checkbox toggles all
 *    rows on the current page; tri-state indicator for partial selection.
 *  - Empty state: `renderNoRows` (custom slot) falls back to `noRowsLabel`
 *    (default: `"No rows"`).
 *
 * Intentionally NOT supported (deferred — open when a section needs them):
 *  - Column resizing, reordering, pinning.
 *  - UI filters toolbar (push filtering to the data layer).
 *  - Tree rows, row grouping.
 *  - Inline editing, virtualization (prefer FlashList directly for > ~200 rows).
 */

import { useMemo } from 'react';
import { DataTable } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

import { Checkbox } from './Checkbox';
import { Typography } from './Typography';
import { LinearProgress } from './LinearProgress';

import type { SxProp } from './types';
import type { JSX, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

// ----------------------------------------------------------------------

const SELECTION_COLUMN_WIDTH = 48;

const styles = StyleSheet.create({
  fixedCell: { flex: 0 },
  selectionCell: { flex: 0, width: SELECTION_COLUMN_WIDTH, paddingHorizontal: 0 },
  empty: { padding: 24, alignItems: 'center' },
});

// ----------------------------------------------------------------------

export type SortDirection = 'asc' | 'desc';

export type DataGridRowId = string | number;

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
  getRowId?: (row: R) => DataGridRowId;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  checkboxSelection?: boolean;
  rowSelectionModel?: ReadonlyArray<DataGridRowId>;
  onRowSelectionModelChange?: (model: DataGridRowId[]) => void;
  renderNoRows?: () => ReactNode;
  noRowsLabel?: string;
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
  getRowId = (row) => (row as { id?: DataGridRowId }).id ?? JSON.stringify(row),
  page,
  pageSize,
  onPageChange,
  checkboxSelection,
  rowSelectionModel,
  onRowSelectionModelChange,
  renderNoRows,
  noRowsLabel = 'No rows',
  testID,
  style,
  sx,
}: DataGridProps<R>): JSX.Element {
  const hasPagination = page !== undefined && pageSize !== undefined;
  const totalPages = hasPagination ? Math.max(1, Math.ceil(rows.length / pageSize)) : 1;
  const pagedRows = hasPagination ? rows.slice(page * pageSize, (page + 1) * pageSize) : rows;

  const selectedSet = useMemo(
    () => new Set<DataGridRowId>(rowSelectionModel ?? []),
    [rowSelectionModel]
  );

  const pageIds = useMemo(() => pagedRows.map(getRowId), [pagedRows, getRowId]);
  const pageSelectedCount = pageIds.reduce<number>(
    (acc, id) => acc + (selectedSet.has(id) ? 1 : 0),
    0
  );
  const allPageSelected = pageIds.length > 0 && pageSelectedCount === pageIds.length;
  const somePageSelected = pageSelectedCount > 0 && !allPageSelected;

  const toggleRow = (id: DataGridRowId, checked: boolean): void => {
    if (!onRowSelectionModelChange) return;
    const next = new Set(selectedSet);
    if (checked) next.add(id);
    else next.delete(id);
    onRowSelectionModelChange([...next]);
  };

  const toggleAllOnPage = (checked: boolean): void => {
    if (!onRowSelectionModelChange) return;
    const next = new Set(selectedSet);
    if (checked) pageIds.forEach((id) => next.add(id));
    else pageIds.forEach((id) => next.delete(id));
    onRowSelectionModelChange([...next]);
  };

  const hasRows = pagedRows.length > 0;

  return (
    <View style={[style, sx]} testID={testID}>
      {loading ? <LinearProgress variant="indeterminate" /> : null}
      <DataTable>
        <DataTable.Header>
          {checkboxSelection ? (
            <DataTable.Title style={styles.selectionCell}>
              <Checkbox
                checked={allPageSelected}
                indeterminate={somePageSelected}
                onChange={toggleAllOnPage}
                disabled={!hasRows || !onRowSelectionModelChange}
              />
            </DataTable.Title>
          ) : null}
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

        {hasRows ? (
          pagedRows.map((row) => {
            const rowId = getRowId(row);
            const isSelected = selectedSet.has(rowId);
            return (
              <DataTable.Row key={rowId}>
                {checkboxSelection ? (
                  <DataTable.Cell style={styles.selectionCell}>
                    <Checkbox
                      checked={isSelected}
                      onChange={(checked) => toggleRow(rowId, checked)}
                      disabled={!onRowSelectionModelChange}
                    />
                  </DataTable.Cell>
                ) : null}
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
            );
          })
        ) : (
          <View style={styles.empty}>
            {renderNoRows ? (
              renderNoRows()
            ) : (
              <Typography variant="body2" color="inherit">
                {noRowsLabel}
              </Typography>
            )}
          </View>
        )}

        {hasPagination && hasRows ? (
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
