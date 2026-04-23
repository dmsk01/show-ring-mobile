# `src/components/mui/` — MUI-compatible adapter layer

Drop-in replacements for `@mui/material` components, implemented on top of `react-native-paper` and React Native primitives. Section code copied from the web repo (`G:/Work/show-ring`) should port mechanically: same component names, same prop names, largely the same prop values.

> This doc is a **support matrix and deviation log**, not an API reference. When in doubt, read the JSDoc header at the top of each component file — every adapter documents its own deviations.

---

## Cross-cutting conventions

| Prop family      | Supported?            | Notes                                                                      |
| ---------------- | --------------------- | -------------------------------------------------------------------------- |
| `variant`        | yes                   | Values mirror MUI (`contained`/`outlined`/`text`/`soft`, etc.).            |
| `color`          | yes                   | `primary`/`secondary`/`info`/`success`/`warning`/`error`/`inherit`.        |
| `size`           | yes                   | `small`/`medium`/`large`.                                                  |
| `sx`             | **partial**           | Flat RN style object (or array). **No media queries, no pseudo-classes.** |
| `component="…"`  | **no**                | RN has no polymorphic rendering.                                           |
| `onClick`        | mapped                | Aliased internally to RN `onPress`. No SyntheticEvent — `onChange` receives the raw value. |
| `icon` / adornments | `IconSource`       | Paper icon name (string) / component / render fn. Not a `ReactNode`. See `types.ts`. |
| `style`          | yes                   | RN `StyleProp<ViewStyle>` (or TextStyle / ImageStyle per component).       |
| `testID`         | yes                   | Prefer `testID` over MUI's `data-testid`.                                  |
| Theme tokens     | **required**          | Use theme tokens (palette, spacing, shadows). **Never hardcode hex / px.** |

---

## Component matrix

Legend: ✅ supported · ⚠️ partial · ❌ not supported (YAGNI or platform gap)

### Layout

| Component  | Supported props                                             | Deviations / notes                                       |
| ---------- | ----------------------------------------------------------- | -------------------------------------------------------- |
| `Box`      | style, sx, children                                         | Thin `View` wrapper.                                     |
| `Stack`    | direction, spacing, alignItems, justifyContent, divider     | `divider` inserted between children.                     |
| `Divider`  | orientation, flexItem                                       | Thin themed `View`.                                      |
| `Card` & subs (`CardContent`, `CardHeader`, `CardActions`) | variant, sx, children | Paper `Card` under the hood.           |

### Typography

| Component    | Supported props                                    | Deviations / notes                                       |
| ------------ | -------------------------------------------------- | -------------------------------------------------------- |
| `Typography` | variant, color, align, noWrap, gutterBottom, children | Maps MUI variants to Paper `Text` with theme typography. |

### Inputs

| Component     | Supported props                                              | Deviations / notes                                                |
| ------------- | ------------------------------------------------------------ | ----------------------------------------------------------------- |
| `Button`      | variant (`contained`/`outlined`/`text`/`soft`), color, size, startIcon, endIcon, disabled, fullWidth, onClick | `startIcon`/`endIcon` are `IconSource`. Soft = Paper contained + alpha bg. |
| `IconButton`  | color, size, disabled, onClick                               | Paper `IconButton`.                                               |
| `TextField`   | label, value, defaultValue, placeholder, onChange, helperText, error, disabled, required, autoFocus, fullWidth, multiline, rows, variant, type, size, startAdornment, endAdornment | `onChange(value: string)` — raw text, no event. `inputRef`, `InputProps`, `select` ❌. |
| `Switch`      | checked, onChange, color, disabled                           | Paper `Switch`.                                                   |
| `Checkbox`    | checked, onChange, color, disabled                           | Paper `Checkbox`.                                                 |
| `Radio` / `RadioGroup` | value, onChange, children, disabled              | Paper `RadioButton` under `RadioButton.Group`.                    |
| `Slider`      | value, onChange, min, max, step, color, disabled             | **Tap-to-set only** — drag deferred `TODO(stage-2)`. `marks`, `valueLabelDisplay`, vertical ❌. |
| `Autocomplete`| options, value, onChange, getOptionLabel, disabled, fullWidth, placeholder, label | Renders TextField + Menu dropdown. Multi-select, freeSolo, groupBy ❌. |
| `DatePicker`  | value (ISO yyyy-MM-dd), onChange, label, disabled            | **Text input only** — native calendar deferred `TODO(stage-4)`. Parses via dayjs regex. |

### Feedback

| Component         | Supported props                                  | Deviations / notes                                                |
| ----------------- | ------------------------------------------------ | ----------------------------------------------------------------- |
| `CircularProgress`| color, size                                      | RN `ActivityIndicator`.                                           |
| `LinearProgress`  | variant (`determinate`/`indeterminate`), value, color | Paper `ProgressBar`.                                         |
| `Skeleton`        | variant (`text`/`rectangular`/`circular`), width, height, animation | Reanimated opacity pulse.                                |
| `Snackbar`        | open, onClose, message, autoHideDuration, action | Paper `Snackbar`.                                                 |
| `Dialog` & subs (`DialogTitle`, `DialogContent`, `DialogActions`) | open, onClose, fullWidth, children | Paper `Portal` + `Dialog`. |
| `Tooltip`         | title, children                                  | Paper `Tooltip` on long-press (RN has no hover).                 |
| `Badge`           | badgeContent, color, max, invisible, showZero, children | Custom absolute wrapper over Paper `Badge`. `anchorOrigin`, `variant='dot'`, `overlap` ❌. |

### Navigation

| Component       | Supported props                          | Deviations / notes                                                  |
| --------------- | ---------------------------------------- | ------------------------------------------------------------------- |
| `Tabs` / `Tab`  | value, onChange, color, children         | Custom row of `TouchableRipple` with underline. `variant='scrollable'` ❌. |
| `Breadcrumbs`   | separator, children                      | Rendered row with separator between children. `maxItems`, collapse ❌ (YAGNI — use vertical stack on tight widths). |
| `Menu` / `MenuItem` | anchor, open, onClose, children, onPress | `anchor` prop replaces MUI `anchorEl` (RN measures the ref).        |
| `Accordion` & subs (`AccordionSummary`, `AccordionDetails`) | expanded, defaultExpanded, onChange, disabled | Paper `List.Accordion`. `TransitionComponent`, `square` ❌. |

### Data display

| Component    | Supported props                                         | Deviations / notes                                                |
| ------------ | ------------------------------------------------------- | ----------------------------------------------------------------- |
| `Avatar`     | src, alt, children, variant (`circular`/`rounded`/`square`), size | Image / Text / Icon route.                               |
| `Chip`       | label, color, onDelete, onClick, icon, variant, size, disabled | Paper `Chip`.                                                |
| `DataGrid`   | columns (field, headerName, width, flex, sortable, renderCell), rows, loading, sortModel, onSortChange, getRowId, page, pageSize, onPageChange | Simplified. **No** column resizing, filters, pinning, row selection, virtualization, editing. For very large datasets, use `FlashList` directly. |

---

## Deviations summary (applies to the whole layer)

- **No `anchorEl` / DOM refs.** Menus use an `anchor` prop that hands RN measurement to Paper.
- **No SyntheticEvent.** `onChange(value)` receives the value; use `onBlur`/`onFocus` for lifecycle.
- **No `component="a"` or `component={Link}`.** Route via `src/routes/hooks/` wrappers instead.
- **Icons are `IconSource`**, not `ReactNode`. This matches Paper + `@expo/vector-icons`.
- **`sx` is a flat style object.** Media queries and pseudo-selectors are not supported; use `useResponsive()` if you need width-based branches.
- **All theme access via `useTheme()`** from `src/theme`. Never import Material theme tokens.

---

## When to add a new adapter

1. Confirm the component is actually used by the current or upcoming stage.
2. Prefer wrapping a Paper / RN primitive over reimplementing from scratch (gestures and animations especially).
3. Define a strict prop type — no `any`, explicit return type.
4. Add a JSDoc header listing supported props and every deviation.
5. Export from `src/components/mui/index.ts`.
6. Update this README's matrix in the same commit.
