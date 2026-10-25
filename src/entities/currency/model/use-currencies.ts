import { useAsync } from '@/shared/lib';
import { fetchCurrencies } from '../api/currency-api';

export function useCurrencies() {
  return useAsync(() => fetchCurrencies(), []);
}
