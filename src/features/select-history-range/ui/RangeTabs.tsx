import { HISTORY_RANGES } from '../model/ranges';
import type { HistoryRangeId } from '../model/ranges';
import styles from './RangeTabs.module.css';

interface RangeTabsProps {
  value: HistoryRangeId;
  onChange: (id: HistoryRangeId) => void;
}

export function RangeTabs({ value, onChange }: RangeTabsProps) {
  return (
    <div className={styles.group} role="group" aria-label="History range">
      {HISTORY_RANGES.map((range) => (
        <button
          key={range.id}
          type="button"
          className={styles.tab}
          aria-pressed={range.id === value}
          aria-label={range.label}
          onClick={() => onChange(range.id)}
        >
          {range.id}
        </button>
      ))}
    </div>
  );
}
