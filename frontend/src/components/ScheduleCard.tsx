import type { EvaluatedSchedule } from "../types/schedule";
import styles from "./ScheduleCard.module.css";

interface ScheduleCardProps {
  schedule: EvaluatedSchedule;
  onViewDetail: (schedule: EvaluatedSchedule) => void;
}

export function ScheduleCard({ schedule, onViewDetail }: ScheduleCardProps) {
  const { valid } = schedule.evaluation;

  return (
    <div className={valid ? styles.validCard : styles.discardedCard}>
      <div className={styles.header}>
        <span className={valid ? styles.validBadge : styles.discardedBadge}>
          {valid ? "Válido" : "Descartado"}
        </span>
        <span>{schedule.totalCredits} créditos</span>
      </div>

      <ul className={styles.courseList}>
        {schedule.courses.map((courseName) => (
          <li key={courseName}>{courseName}</li>
        ))}
      </ul>

      {!valid && (
        <ul className={styles.reasons}>
          {schedule.evaluation.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      )}

      <button onClick={() => onViewDetail(schedule)}>Ver detalle</button>
    </div>
  );
}