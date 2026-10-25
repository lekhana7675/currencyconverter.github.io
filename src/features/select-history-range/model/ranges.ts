import { subtractDays, toISODate } from '@/shared/lib';

export const HISTORY_RANGES = [
  { id: '1M', label: '1 month', days: 30 },
  { id: '3M', label: '3 months', days: 90 },
  { id: '6M', label: '6 months', days: 182 },
  { id: '1Y', label: '1 year', days: 365 },
  { id: '5Y', label: '5 years', days: 1825 },
] as const;

export type HistoryRangeId = (typeof HISTORY_RANGES)[number]['id'];

export const DEFAULT_HISTORY_RANGE: HistoryRangeId = '3M';

export function isHistoryRangeId(value: unknown): value is HistoryRangeId {
  return HISTORY_RANGES.some((range) => range.id === value);
}

export function getHistoryRange(id: HistoryRangeId) {
  return HISTORY_RANGES.find((range) => range.id === id) ?? HISTORY_RANGES[1];
}

/** Start/end dates (YYYY-MM-DD) covering the chosen range, ending today. */
export function getRangeDates(id: HistoryRangeId, today: Date = new Date()) {
  const { days } = getHistoryRange(id);
  return { start: toISODate(subtractDays(today, days)), end: toISODate(today) };
}
