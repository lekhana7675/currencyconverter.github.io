import styles from './SwapButton.module.css';

interface SwapButtonProps {
  onSwap: () => void;
}

export function SwapButton({ onSwap }: SwapButtonProps) {
  return (
    <button type="button" className={styles.button} onClick={onSwap} aria-label="Swap currencies">
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          d="M8 4v14m0 0-3.5-3.5M8 18l3.5-3.5M16 20V6m0 0-3.5 3.5M16 6l3.5 3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
