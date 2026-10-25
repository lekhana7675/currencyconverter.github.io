import type { CurrencyOption } from '../model/types';
import styles from './CurrencySelect.module.css';

interface CurrencySelectProps {
  id: string;
  label: string;
  value: string;
  options: readonly CurrencyOption[];
  onChange: (code: string) => void;
}

export function CurrencySelect({ id, label, value, options, onChange }: CurrencySelectProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <select
        id={id}
        className={styles.select}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.code} value={option.code}>
            {option.name === option.code ? option.code : `${option.name} (${option.code})`}
          </option>
        ))}
      </select>
    </div>
  );
}
