// ----------------------------------------------------------------------

export function fCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
}

export function fNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function fPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/** Format file size in bytes to human-readable string (e.g. "3 MB"). */
export function fData(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
