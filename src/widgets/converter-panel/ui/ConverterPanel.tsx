import { useId } from 'react';
import { useCurrencies } from '@/entities/currency';
import type { CurrencyOption } from '@/entities/currency';
import { ConversionResult, ConvertForm, useConversion } from '@/features/convert-currency';
import type { ConverterState } from '@/features/convert-currency';
import { SwapButton } from '@/features/swap-currencies';
import { ErrorNotice } from '@/shared/ui';
import styles from './ConverterPanel.module.css';

interface ConverterPanelProps {
  state: ConverterState;
  onAmountChange: (amount: string) => void;
  onFromChange: (code: string) => void;
  onToChange: (code: string) => void;
  onSwap: () => void;
}

export function ConverterPanel({
  state,
  onAmountChange,
  onFromChange,
  onToChange,
  onSwap,
}: ConverterPanelProps) {
  const headingId = useId();
  const currencies = useCurrencies();
  const { rate, amount } = useConversion(state.amount, state.from, state.to);

  // Until the list loads (or if it fails), the selects still show the current pair.
  const options: readonly CurrencyOption[] =
    currencies.status === 'success'
      ? currencies.data
      : Array.from(new Set([state.from, state.to])).map((code) => ({ code, name: code }));

  const toName =
    currencies.status === 'success'
      ? currencies.data.find((currency) => currency.code === state.to)?.name
      : undefined;

  return (
    <section className={styles.panel} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.title}>
        Convert
      </h2>

      {currencies.status === 'error' && (
        <ErrorNotice
          title="Couldn't load the currency list"
          message={currencies.error.message}
          onRetry={currencies.reload}
        />
      )}

      <ConvertForm
        amount={state.amount}
        from={state.from}
        to={state.to}
        currencies={options}
        swapControl={<SwapButton onSwap={onSwap} />}
        onAmountChange={onAmountChange}
        onFromChange={onFromChange}
        onToChange={onToChange}
      />

      <ConversionResult
        amount={amount}
        from={state.from}
        to={state.to}
        toName={toName}
        rate={rate}
        onRetry={rate.reload}
      />
    </section>
  );
}
