import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

/** useState backed by localStorage. Stored values are validated before use. */
export function usePersistedState<T>(
  key: string,
  initial: T,
  isValid: (value: unknown) => value is T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        const parsed: unknown = JSON.parse(raw);
        if (isValid(parsed)) return parsed;
      }
    } catch {
      // Storage unavailable or corrupted: fall back to the initial value.
    }
    return initial;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore quota or privacy-mode errors.
    }
  }, [key, value]);

  return [value, setValue];
}
