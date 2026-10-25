/** Locale-aware formatting. `undefined` locale = the visitor's browser locale. */

export function formatAmount(value: number): string {
  const maxDigits = value !== 0 && Math.abs(value) < 1 ? 4 : 2;
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDigits,
  }).format(value);
}

export function formatRate(value: number): string {
  return new Intl.NumberFormat(undefined, { maximumSignificantDigits: 6 }).format(value);
}

export function formatSignedRate(value: number): string {
  return new Intl.NumberFormat(undefined, {
    maximumSignificantDigits: 4,
    signDisplay: 'exceptZero',
  }).format(value);
}

/** Takes a percentage (1.5 means 1.5%). */
export function formatPercent(percentage: number): string {
  return new Intl.NumberFormat(undefined, {
    style: 'percent',
    maximumFractionDigits: 2,
    signDisplay: 'exceptZero',
  }).format(percentage / 100);
}

export function formatDate(
  isoDate: string,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' },
): string {
  return new Intl.DateTimeFormat(undefined, { ...options, timeZone: 'UTC' }).format(
    new Date(`${isoDate}T00:00:00Z`),
  );
}
