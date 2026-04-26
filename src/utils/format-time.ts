import dayjs from 'dayjs';

import type { IDateValue } from 'src/types/common';

// ----------------------------------------------------------------------

export function fDate(date: IDateValue, format = 'DD MMM YYYY'): string {
  if (!date) return '';
  return dayjs(date).format(format);
}

export function fDateTime(date: IDateValue, format = 'DD MMM YYYY HH:mm'): string {
  if (!date) return '';
  return dayjs(date).format(format);
}

export function fSub(_options: Parameters<typeof dayjs>[0]): string {
  return dayjs().subtract(1, 'day').toISOString();
}
