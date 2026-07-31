import { useState } from "react";
import type {
  GenerateScheduleResponse,
  EvaluatedSchedule,
} from "../types/schedule";
import { ScheduleCard } from "../components/ScheduleCard";
import styles from "./ResultsPage.module.css";
import { MathBadge } from "../components/MathBadge";

interface ResultsPageProps {
  result: GenerateScheduleResponse;
  onViewDetail: (schedule: EvaluatedSchedule) => void;
}

type FilterOption = "all" | "valid" | "discarded";

export function ResultsPage({ result, onViewDetail }: ResultsPageProps) {
  const [filter, setFilter] = useState<FilterOption>("all");

  const schedulesToShow =
    filter === "valid"
      ? result.validSchedules
      : filter === "discarded"
      ? result.discardedSchedules
      : [...result.validSchedules, ...result.discardedSchedules];

  return (
    <div>
      <h2>Resultados</h2>
      <MathBadge notation="T ∧ O ∧ C ∧ D ∧ R" label="Regla de validación" />

      <div className={styles.summary}>
        <p>Materias disponibles: {result.totalCourses}</p>
        <p>Materias por horario: {result.selectedAmount}</p>
        <p>Combinaciones posibles (C(n,r)): {result.totalCombinations}</p>
        <p>Horarios válidos: {result.validSchedulesCount}</p>
        <p>Horarios descartados: {result.discardedSchedulesCount}</p>
      </div>

      <div className={styles.filters}>
        <button onClick={() => setFilter("all")} disabled={filter === "all"}>
          Todos ({result.totalCombinations})
        </button>
        <button
          onClick={() => setFilter("valid")}
          disabled={filter === "valid"}
        >
          Válidos ({result.validSchedulesCount})
        </button>
        <button
          onClick={() => setFilter("discarded")}
          disabled={filter === "discarded"}
        >
          Descartados ({result.discardedSchedulesCount})
        </button>
      </div>

      <div>
        {schedulesToShow.map((schedule, index) => (
          <ScheduleCard
            key={schedule.courses.join("-") + index}
            schedule={schedule}
            onViewDetail={onViewDetail}
          />
        ))}
      </div>
    </div>
  );
}