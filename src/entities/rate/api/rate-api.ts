import { getJson } from '@/shared/api';
import { toISODate } from '@/shared/lib';
import type { DateRange, LatestRate, RatePoint } from '../model/types';

interface LatestResponse {
  date: string;
  rates: Record<string, number>;
}

interface TimeSeriesResponse {
  rates: Record<string, Record<string, number>>;
}

export async function fetchLatestRate(
  base: string,
  quote: string,
  signal?: AbortSignal,
): Promise<LatestRate> {
  if (base === quote) return { date: toISODate(new Date()), rate: 1 };

  const data = await getJson<LatestResponse>('/latest', { base, symbols: quote }, signal);
  const rate = data.rates[quote];
  if (typeof rate !== 'number') {
    throw new Error(`No rate is available for ${base} to ${quote}.`);
  }
  return { date: data.date, rate };
}

export async function fetchRateHistory(
  base: string,
  quote: string,
  range: DateRange,
  signal?: AbortSignal,
): Promise<RatePoint[]> {
  if (base === quote) return [];

  const data = await getJson<TimeSeriesResponse>(
    `/${range.start}..${range.end}`,
    { base, symbols: quote },
    signal,
  );

  return Object.entries(data.rates)
    .flatMap(([date, rates]) => {
      const value = rates[quote];
      return typeof value === 'number' ? [{ date, value }] : [];
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}
