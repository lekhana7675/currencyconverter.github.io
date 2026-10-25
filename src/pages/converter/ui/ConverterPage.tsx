import { useConverterState } from '@/features/convert-currency';
import { ConverterPanel } from '@/widgets/converter-panel';
import { RateHistoryPanel } from '@/widgets/rate-history-panel';
import styles from './ConverterPage.module.css';

export function ConverterPage() {
  const { state, setAmount, setFrom, setTo, swap } = useConverterState();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.heading}>Currency converter</h1>
        <p className={styles.intro}>
          Convert between currencies and see how the rate has moved. Rates are published each
          working day.
        </p>
      </header>

      <div className={styles.layout}>
        <ConverterPanel
          state={state}
          onAmountChange={setAmount}
          onFromChange={setFrom}
          onToChange={setTo}
          onSwap={swap}
        />
        <RateHistoryPanel from={state.from} to={state.to} />
      </div>

      <footer className={styles.footer}>
        Rates come from{' '}
        <a href="https://frankfurter.dev" target="_blank" rel="noreferrer">
          Frankfurter
        </a>
        , which republishes European Central Bank reference rates. They are for information only
        and are not a quote for trading or transfers.
      </footer>
    </main>
  );
}
