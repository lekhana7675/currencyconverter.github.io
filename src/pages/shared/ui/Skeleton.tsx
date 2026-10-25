import styles from './Skeleton.module.css';

interface SkeletonProps {
  height: string;
  width?: string;
}

export function Skeleton({ height, width = '100%' }: SkeletonProps) {
  return <div className={styles.skeleton} style={{ height, width }} aria-hidden="true" />;
}
