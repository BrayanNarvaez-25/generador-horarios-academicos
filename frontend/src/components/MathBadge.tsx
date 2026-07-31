import styles from "./MathBadge.module.css";

interface MathBadgeProps {
  notation: string;
  label: string;
}

export function MathBadge({ notation, label }: MathBadgeProps) {
  return (
    <div className={styles.badge}>
      <span className={styles.notation}>{notation}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}