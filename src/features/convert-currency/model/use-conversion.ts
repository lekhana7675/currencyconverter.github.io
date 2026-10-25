import { fetchLatestRate } from '@/entities/rate';
import { useAsync } from '@/shared/lib';
import { parseAmount } from '../lib/parse-amount';

/** Fetches the latest rate for the pair and parses the typed amount. */
export function useConversion(amountInput: string, from: string, to: string) {
  const rate = useAsync((signal) => fetchLatestRate(from, to, signal), [from, to]);
  const amount = parseAmount(amountInput);
  return { rate, amount };
}
