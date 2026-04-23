/**
 * Palette tokens — values copied verbatim from
 * `G:/Work/show-ring/src/theme/theme-config.ts`.
 *
 * Web palette relies on CSS custom properties with `r g b` space-separated
 * channels (CSS Color 4). React Native has no CSS vars, so we expose both the
 * raw hex and a `*Channel` string with the same `r g b` shape — callers use
 * `varAlpha(channel, alpha)` to build `rgba()` strings.
 *
 * @see docs/plans/2026-04-22-react-native-port-plan.md §4.1.2
 */

import { opacity } from './opacity';

// ----------------------------------------------------------------------

export type PaletteColorKey = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

export type PaletteColor = {
  lighter: string;
  light: string;
  main: string;
  dark: string;
  darker: string;
  contrastText: string;
  lighterChannel: string;
  lightChannel: string;
  mainChannel: string;
  darkChannel: string;
  darkerChannel: string;
  contrastTextChannel: string;
};

export type CommonColors = {
  black: string;
  white: string;
  blackChannel: string;
  whiteChannel: string;
};

export type GreyShade =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

export type GreyPalette = Record<GreyShade, string> & Record<`${GreyShade}Channel`, string>;

export type TypeText = {
  primary: string;
  secondary: string;
  disabled: string;
  primaryChannel: string;
  secondaryChannel: string;
  disabledChannel: string;
};

export type TypeBackground = {
  paper: string;
  default: string;
  neutral: string;
  paperChannel: string;
  defaultChannel: string;
  neutralChannel: string;
};

export type TypeAction = {
  active: string;
  hover: string;
  selected: string;
  focus: string;
  disabled: string;
  disabledBackground: string;
  hoverOpacity: number;
  selectedOpacity: number;
  focusOpacity: number;
  activatedOpacity: number;
  disabledOpacity: number;
};

export type SharedPalette = {
  inputUnderline: string;
  inputOutlined: string;
  paperOutlined: string;
  buttonOutlined: string;
};

export type PaletteMode = 'light' | 'dark';

export type Palette = {
  mode: PaletteMode;
  primary: PaletteColor;
  secondary: PaletteColor;
  info: PaletteColor;
  success: PaletteColor;
  warning: PaletteColor;
  error: PaletteColor;
  common: CommonColors;
  grey: GreyPalette;
  text: TypeText;
  background: TypeBackground;
  action: TypeAction;
  divider: string;
  shared: SharedPalette;
};

// ----------------------------------------------------------------------
// Utilities
// ----------------------------------------------------------------------

/**
 * Convert `#rrggbb` (or `#rgb`) to a space-separated `r g b` channel string.
 * Mirrors MUI's `createPaletteChannel` output shape used on the web.
 */
export function hexToChannel(hex: string): string {
  const normalized = hex.replace('#', '').trim();
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

/**
 * Build an `rgba()` color string from an `r g b` channel and alpha.
 * Direct equivalent of `minimal-shared/utils/varAlpha`.
 */
export function varAlpha(channel: string, alphaValue: number): string {
  const [r, g, b] = channel.split(' ');
  return `rgba(${r}, ${g}, ${b}, ${alphaValue})`;
}

function createPaletteChannel<T extends Record<string, string>>(
  input: T
): T & Record<`${Extract<keyof T, string>}Channel`, string> {
  const out: Record<string, string> = { ...input };
  for (const key of Object.keys(input)) {
    out[`${key}Channel`] = hexToChannel(input[key]);
  }
  return out as T & Record<`${Extract<keyof T, string>}Channel`, string>;
}

// ----------------------------------------------------------------------
// Raw token values (must match web `themeConfig.palette`)
// ----------------------------------------------------------------------

const primaryBase = {
  lighter: '#C8FAD6',
  light: '#5BE49B',
  main: '#00A76F',
  dark: '#007867',
  darker: '#004B50',
  contrastText: '#FFFFFF',
} as const;

const secondaryBase = {
  lighter: '#EFD6FF',
  light: '#C684FF',
  main: '#8E33FF',
  dark: '#5119B7',
  darker: '#27097A',
  contrastText: '#FFFFFF',
} as const;

const infoBase = {
  lighter: '#CAFDF5',
  light: '#61F3F3',
  main: '#00B8D9',
  dark: '#006C9C',
  darker: '#003768',
  contrastText: '#FFFFFF',
} as const;

const successBase = {
  lighter: '#D3FCD2',
  light: '#77ED8B',
  main: '#22C55E',
  dark: '#118D57',
  darker: '#065E49',
  contrastText: '#FFFFFF',
} as const;

const warningBase = {
  lighter: '#FFF5CC',
  light: '#FFD666',
  main: '#FFAB00',
  dark: '#B76E00',
  darker: '#7A4100',
  contrastText: '#1C252E',
} as const;

const errorBase = {
  lighter: '#FFE9D5',
  light: '#FFAC82',
  main: '#FF5630',
  dark: '#B71D18',
  darker: '#7A0916',
  contrastText: '#FFFFFF',
} as const;

const commonBase = {
  black: '#000000',
  white: '#FFFFFF',
} as const;

const greyBase = {
  '50': '#FCFDFD',
  '100': '#F9FAFB',
  '200': '#F4F6F8',
  '300': '#DFE3E8',
  '400': '#C4CDD5',
  '500': '#919EAB',
  '600': '#637381',
  '700': '#454F5B',
  '800': '#1C252E',
  '900': '#141A21',
} as const;

// ----------------------------------------------------------------------
// Exported palette channels
// ----------------------------------------------------------------------

export const primary: PaletteColor = createPaletteChannel(primaryBase);
export const secondary: PaletteColor = createPaletteChannel(secondaryBase);
export const info: PaletteColor = createPaletteChannel(infoBase);
export const success: PaletteColor = createPaletteChannel(successBase);
export const warning: PaletteColor = createPaletteChannel(warningBase);
export const error: PaletteColor = createPaletteChannel(errorBase);
export const common: CommonColors = createPaletteChannel(commonBase);
export const grey: GreyPalette = createPaletteChannel(greyBase) as GreyPalette;

// ----------------------------------------------------------------------
// Text / background / action (mode-dependent)
// ----------------------------------------------------------------------

const textLight = createPaletteChannel({
  primary: grey['800'],
  secondary: grey['600'],
  disabled: grey['500'],
});

const textDark = createPaletteChannel({
  primary: '#FFFFFF',
  secondary: grey['500'],
  disabled: grey['600'],
});

const backgroundLight = createPaletteChannel({
  paper: '#FFFFFF',
  default: '#FFFFFF',
  neutral: grey['200'],
});

const backgroundDark = createPaletteChannel({
  paper: grey['800'],
  default: grey['900'],
  neutral: '#28323D',
});

function createAction(mode: PaletteMode): TypeAction {
  return {
    active: mode === 'light' ? grey['600'] : grey['500'],
    hover: varAlpha(grey['500Channel'], 0.08),
    selected: varAlpha(grey['500Channel'], 0.16),
    focus: varAlpha(grey['500Channel'], 0.24),
    disabled: varAlpha(grey['500Channel'], 0.8),
    disabledBackground: varAlpha(grey['500Channel'], 0.24),
    hoverOpacity: 0.08,
    selectedOpacity: 0.08,
    focusOpacity: 0.12,
    activatedOpacity: 0.12,
    disabledOpacity: 0.48,
  };
}

const sharedPalette: SharedPalette = {
  inputUnderline: varAlpha(grey['500Channel'], opacity.inputUnderline),
  inputOutlined: varAlpha(grey['500Channel'], 0.2),
  paperOutlined: varAlpha(grey['500Channel'], 0.16),
  buttonOutlined: varAlpha(grey['500Channel'], 0.32),
};

// ----------------------------------------------------------------------
// Final palette
// ----------------------------------------------------------------------

export const palette: Record<PaletteMode, Palette> = {
  light: {
    mode: 'light',
    primary,
    secondary,
    info,
    success,
    warning,
    error,
    common,
    grey,
    text: textLight as TypeText,
    background: backgroundLight as TypeBackground,
    action: createAction('light'),
    divider: varAlpha(grey['500Channel'], 0.2),
    shared: sharedPalette,
  },
  dark: {
    mode: 'dark',
    primary,
    secondary,
    info,
    success,
    warning,
    error,
    common,
    grey,
    text: textDark as TypeText,
    background: backgroundDark as TypeBackground,
    action: createAction('dark'),
    divider: varAlpha(grey['500Channel'], 0.2),
    shared: sharedPalette,
  },
};

export const colorKeys: {
  palette: PaletteColorKey[];
  common: ('black' | 'white')[];
} = {
  palette: ['primary', 'secondary', 'info', 'success', 'warning', 'error'],
  common: ['black', 'white'],
};
