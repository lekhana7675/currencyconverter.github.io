import styles from './ErrorNotice.module.css';

interface ErrorNoticeProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorNotice({ title, message, onRetry }: ErrorNoticeProps) {
  return (
    <div className={styles.notice} role="alert">
      <p className={styles.title}>{title}</p>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
