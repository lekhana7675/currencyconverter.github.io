import { getJson } from '@/shared/api';
import type { CurrencyOption } from '../model/types';

let cache: Promise<CurrencyOption[]> | null = null;

/**
 * The currency list rarely changes, so it is fetched once per page load and shared
 * by every component that needs it. A failed request is not cached.
 */
export function fetchCurrencies(): Promise<CurrencyOption[]> {
  if (!cache) {
    cache = getJson<Record<string, string>>('/currencies')
      .then((map) =>
        Object.entries(map)
          .map(([code, name]) => ({ code, name }))
          .sort((a, b) => a.name.localeCompare(b.name)),
      )
      .catch((error: unknown) => {
        cache = null;
        throw error;
      });
  }
  return cache;
}
