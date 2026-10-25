import { useCallback } from 'react';
import { DEFAULT_PAIR, STORAGE_KEYS } from '@/shared/config';
import { usePersistedState } from '@/shared/lib';

export interface ConverterState {
  /** Raw text from the amount field, so partial input like "12." is preserved. */
  amount: string;
  from: string;
  to: string;
}

const INITIAL_STATE: ConverterState = {
  amount: '100',
  from: DEFAULT_PAIR.from,
  to: DEFAULT_PAIR.to,
};

function isConverterState(value: unknown): value is ConverterState {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.amount === 'string' &&
    typeof candidate.from === 'string' &&
    typeof candidate.to === 'string'
  );
}

/** Amount and currency pair, remembered between visits. */
export function useConverterState() {
  const [state, setState] = usePersistedState(
    STORAGE_KEYS.converter,
    INITIAL_STATE,
    isConverterState,
  );

  const setAmount = useCallback(
    (amount: string) => setState((current) => ({ ...current, amount })),
    [setState],
  );

  // Choosing the currency that is already on the other side swaps the two.
  const setFrom = useCallback(
    (from: string) =>
      setState((current) =>
        from === current.to ? { ...current, from, to: current.from } : { ...current, from },
      ),
    [setState],
  );

  const setTo = useCallback(
    (to: string) =>
      setState((current) =>
        to === current.from ? { ...current, to, from: current.to } : { ...current, to },
      ),
    [setState],
  );

  const swap = useCallback(
    () => setState((current) => ({ ...current, from: current.to, to: current.from })),
    [setState],
  );

  return { state, setAmount, setFrom, setTo, swap };
}
