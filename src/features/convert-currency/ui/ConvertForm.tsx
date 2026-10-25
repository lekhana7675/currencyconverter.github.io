import { useId } from 'react';
import type { ReactNode } from 'react';
import { CurrencySelect } from '@/entities/currency';
import type { CurrencyOption } from '@/entities/currency';
import { parseAmount } from '../lib/parse-amount';
import styles from './ConvertForm.module.css';

interface ConvertFormProps {
  amount: string;
  from: string;
  to: string;
  currencies: readonly CurrencyOption[];
  /** Rendered between the two selects. Features cannot import each other, so the widget supplies it. */
  swapControl: ReactNode;
  onAmountChange: (amount: string) => void;
  onFromChange: (code: string) => void;
  onToChange: (code: string) => void;
}

export function ConvertForm({
  amount,
  from,
  to,
  currencies,
  swapControl,
  onAmountChange,
  onFromChange,
  onToChange,
}: ConvertFormProps) {
  const amountId = useId();
  const fromId = useId();
  const toId = useId();
  const hintId = useId();
  const invalid = amount.trim() !== '' && parseAmount(amount) === null;

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label htmlFor={amountId} className={styles.label}>
          Amount
        </label>
        <input
          id={amountId}
          className={styles.input}
          value={amount}
          inputMode="decimal"
          autoComplete="off"
          aria-invalid={invalid}
          aria-describedby={invalid ? hintId : undefined}
          onChange={(event) => onAmountChange(event.target.value)}
        />
        {invalid && (
          <p id={hintId} className={styles.hint}>
            Enter a number, like 250 or 99.50.
          </p>
        )}
      </div>

      <CurrencySelect id={fromId} label="From" value={from} options={currencies} onChange={onFromChange} />
      <div className={styles.swap}>{swapControl}</div>
      <CurrencySelect id={toId} label="To" value={to} options={currencies} onChange={onToChange} />
    </div>
  );
}
