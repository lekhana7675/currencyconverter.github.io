import { formatDate, formatPercent, formatRate, formatSignedRate } from '@/shared/lib';
import { summarizeRates } from '../lib/stats';
import type { RatePoint } from '../model/types';
import styles from './RateStats.module.css';

interface RateStatsProps {
  points: readonly RatePoint[];
  quote: string;
}

export function RateStats({ points, quote }: RateStatsProps) {
  const summary = summarizeRates(points);
  if (!summary) return null;

  const direction =
    summary.change > 0 ? styles.up : summary.change < 0 ? styles.down : styles.flat;

  return (
    <dl className={styles.stats}>
      <div className={styles.item}>
        <dt>Change</dt>
        <dd className={`${styles.value} ${direction}`}>
          {formatPercent(summary.changePercent)}
        </dd>
        <dd className={styles.note}>
          {formatSignedRate(summary.change)} {quote}
        </dd>
      </div>
      <div className={styles.item}>
        <dt>Highest</dt>
        <dd className={styles.value}>{formatRate(summary.high.value)}</dd>
        <dd className={styles.note}>{formatDate(summary.high.date)}</dd>
      </div>
      <div className={styles.item}>
        <dt>Lowest</dt>
        <dd className={styles.value}>{formatRate(summary.low.value)}</dd>
        <dd className={styles.note}>{formatDate(summary.low.date)}</dd>
      </div>
      <div className={styles.item}>
        <dt>Average</dt>
        <dd className={styles.value}>{formatRate(summary.average)}</dd>
        <dd className={styles.note}>{points.length} data points</dd>
      </div>
    </dl>
  );
}
