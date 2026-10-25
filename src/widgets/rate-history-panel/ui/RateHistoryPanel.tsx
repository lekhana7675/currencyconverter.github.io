import { useId } from 'react';
import { fetchRateHistory, RateChart, RateStats } from '@/entities/rate';
import {
  DEFAULT_HISTORY_RANGE,
  getHistoryRange,
  getRangeDates,
  isHistoryRangeId,
  RangeTabs,
} from '@/features/select-history-range';
import { STORAGE_KEYS } from '@/shared/config';
import { useAsync, usePersistedState } from '@/shared/lib';
import { ErrorNotice, Skeleton } from '@/shared/ui';
import styles from './RateHistoryPanel.module.css';

interface RateHistoryPanelProps {
  from: string;
  to: string;
}

export function RateHistoryPanel({ from, to }: RateHistoryPanelProps) {
  const headingId = useId();
  const [rangeId, setRangeId] = usePersistedState(
    STORAGE_KEYS.historyRange,
    DEFAULT_HISTORY_RANGE,
    isHistoryRangeId,
  );
  const range = getHistoryRange(rangeId);
  const samePair = from === to;

  const history = useAsync(
    (signal) =>
      samePair
        ? Promise.resolve([])
        : fetchRateHistory(from, to, getRangeDates(rangeId), signal),
    [from, to, rangeId],
  );

  return (
    <section className={styles.panel} aria-labelledby={headingId}>
      <div className={styles.header}>
        <div>
          <h2 id={headingId} className={styles.title}>
            Rate history
          </h2>
          <p className={styles.pair}>
            1 {from} in {to}, past {range.label}
          </p>
        </div>
        <RangeTabs value={rangeId} onChange={setRangeId} />
      </div>

      {samePair ? (
        <p className={styles.empty}>Pick two different currencies to see how the rate has moved.</p>
      ) : history.status === 'loading' ? (
        <div className={styles.loading} aria-busy="true" aria-label="Loading rate history">
          <Skeleton height="280px" />
          <Skeleton height="3.5rem" />
        </div>
      ) : history.status === 'error' ? (
        <ErrorNotice
          title="Couldn't load the rate history"
          message={history.error.message}
          onRetry={history.reload}
        />
      ) : history.data.length === 0 ? (
        <p className={styles.empty}>No rates were published for this period.</p>
      ) : (
        <>
          <RateChart points={history.data} quote={to} />
          <RateStats points={history.data} quote={to} />
          {range.days > 90 && (
            <p className={styles.note}>
              Longer ranges use weekly data points instead of daily ones, so the highest and lowest
              values come from that sample.
            </p>
          )}
        </>
      )}
    </section>
  );
}
