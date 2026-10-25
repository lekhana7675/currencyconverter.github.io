/** Frankfurter republishes European Central Bank reference rates. No API key required. */
export const API_BASE_URL = 'https://api.frankfurter.dev/v1';

export const DEFAULT_PAIR = { from: 'USD', to: 'EUR' } as const;

export const STORAGE_KEYS = {
  converter: 'fx-converter:converter:v1',
  historyRange: 'fx-converter:history-range:v1',
} as const;
