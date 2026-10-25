import type { LatestRate } from '@/entities/rate';
import { ErrorNotice, Skeleton } from '@/shared/ui';
import { formatAmount, formatDate, formatRate } from '@/shared/lib';
import type { AsyncState } from '@/shared/lib';
import styles from './ConversionResult.module.css';

interface ConversionResultProps {
  amount: number | null;
  from: string;
  to: string;
  toName?: string;
  rate: AsyncState<LatestRate>;
  onRetry: () => void;
}

export function ConversionResult({ amount, from, to, toName, rate, onRetry }: ConversionResultProps) {
  if (amount === null) {
    return <p className={styles.hint}>Enter an amount to see the converted value.</p>;
  }

  if (rate.status === 'loading') {
    return (
      <div className={styles.loading} aria-busy="true" aria-label="Loading exchange rate">
        <Skeleton height="1.1rem" width="45%" />
        <Skeleton height="3.75rem" />
        <Skeleton height="1rem" width="65%" />
      </div>
    );
  }

  if (rate.status === 'error') {
    return (
      <ErrorNotice
        title="Couldn't load the exchange rate"
        message={rate.error.message}
        onRetry={onRetry}
      />
    );
  }

  const result = amount * rate.data.rate;

  return (
    <div className={styles.result} aria-live="polite">
      <p className={styles.lead}>
        {formatAmount(amount)} {from} equals
      </p>
      <p className={styles.figure}>
        {formatAmount(result)}
        <span className={styles.code}>{to}</span>
      </p>
      {toName && toName !== to && <p className={styles.name}>{toName}</p>}
      <p className={styles.meta}>
        1 {from} = {formatRate(rate.data.rate)} {to}
      </p>
      <p className={styles.meta}>Rate published {formatDate(rate.data.date)}</p>
    </div>
  );
}
