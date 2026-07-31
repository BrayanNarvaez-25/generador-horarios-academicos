import { useCourses } from "../hooks/useCourses";
import type { EvaluatedSchedule } from "../types/schedule";
import styles from "./ScheduleDetailPage.module.css";

interface ScheduleDetailPageProps {
  schedule: EvaluatedSchedule;
  onBack: () => void;
}

export function ScheduleDetailPage({
  schedule,
  onBack,
}: ScheduleDetailPageProps) {
  const { courses: allCourses, loading } = useCourses();

  const detailedCourses = schedule.courses.map((courseName) =>
    allCourses.find((course) => course.name === courseName)
  );

  const { valid, reasons } = schedule.evaluation;

  return (
    <div>
      <button onClick={onBack} className={styles.backButton}>
        ← Volver a resultados
      </button>

      <h2>Detalle del horario</h2>

      <div
        className={valid ? styles.validSummary : styles.discardedSummary}
      >
        <strong>{valid ? "Horario válido" : "Horario descartado"}</strong>
        <p>Total de créditos: {schedule.totalCredits}</p>

        {!valid && (
          <ul>
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        )}
      </div>

      {loading && <p>Cargando detalle de materias...</p>}

      {!loading && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Materia</th>
              <th>Día</th>
              <th>Horario</th>
              <th>Modalidad</th>
              <th>Dificultad</th>
              <th>Créditos</th>
            </tr>
          </thead>
          <tbody>
            {detailedCourses.map((course, index) =>
              course ? (
                <tr key={course.id}>
                  <td>{course.name}</td>
                  <td>{course.day}</td>
                  <td>
                    {course.startTime} - {course.endTime}
                  </td>
                  <td>{course.modality}</td>
                  <td>{course.difficulty}</td>
                  <td>{course.credits}</td>
                </tr>
              ) : (
                <tr key={index}>
                  <td colSpan={6}>
                    Materia no encontrada: {schedule.courses[index]}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}