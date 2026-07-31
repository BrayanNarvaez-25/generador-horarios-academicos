import { useState } from "react";
import type { Course } from "../types/course";
import type { ScheduleConfiguration } from "../types/schedule";
import styles from "./ScheduleConfigForm.module.css";

interface ScheduleConfigFormProps {
  availableCourses: Course[];
  onSubmit: (configuration: ScheduleConfiguration) => Promise<void>;
}

const initialConfiguration: ScheduleConfiguration = {
  numberOfCourses: 3,
  requiredCourses: [],
  maximumCredits: 12,
  maximumDifficultCourses: 2,
  requiredModality: "Cualquiera",
  avoidTimeConflicts: true,
  validatePrerequisites: true,
  completedCourses: [],
};

export function ScheduleConfigForm({
  availableCourses,
  onSubmit,
}: ScheduleConfigFormProps) {
  const [configuration, setConfiguration] = useState<ScheduleConfiguration>(
    initialConfiguration
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleCourseInList(
    courseName: string,
    list: "requiredCourses" | "completedCourses"
  ) {
    setConfiguration((prev) => {
      const currentList = prev[list];
      const alreadyIncluded = currentList.includes(courseName);

      return {
        ...prev,
        [list]: alreadyIncluded
          ? currentList.filter((name) => name !== courseName)
          : [...currentList, courseName],
      };
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onSubmit(configuration);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>Configuración del horario</h3>

      {error && <p className={styles.error}>{error}</p>}

      <label>
        Cantidad de materias
        <input
          type="number"
          min={1}
          value={configuration.numberOfCourses}
          onChange={(e) =>
            setConfiguration({
              ...configuration,
              numberOfCourses: Number(e.target.value),
            })
          }
          required
        />
      </label>

      <label>
        Máximo de créditos
        <input
          type="number"
          min={1}
          value={configuration.maximumCredits}
          onChange={(e) =>
            setConfiguration({
              ...configuration,
              maximumCredits: Number(e.target.value),
            })
          }
          required
        />
      </label>

      <label>
        Máximo de materias difíciles
        <input
          type="number"
          min={0}
          value={configuration.maximumDifficultCourses}
          onChange={(e) =>
            setConfiguration({
              ...configuration,
              maximumDifficultCourses: Number(e.target.value),
            })
          }
          required
        />
      </label>

      <label>
        Modalidad requerida
        <select
          value={configuration.requiredModality}
          onChange={(e) =>
            setConfiguration({
              ...configuration,
              requiredModality: e.target.value as
                | "Cualquiera"
                | "Presencial"
                | "Virtual",
            })
          }
        >
          <option value="Cualquiera">Cualquiera</option>
          <option value="Presencial">Presencial</option>
          <option value="Virtual">Virtual</option>
        </select>
      </label>

      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={configuration.avoidTimeConflicts}
          onChange={(e) =>
            setConfiguration({
              ...configuration,
              avoidTimeConflicts: e.target.checked,
            })
          }
        />
        Evitar cruces de horario
      </label>

      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={configuration.validatePrerequisites}
          onChange={(e) =>
            setConfiguration({
              ...configuration,
              validatePrerequisites: e.target.checked,
            })
          }
        />
        Validar prerrequisitos
      </label>

      <fieldset className={styles.fieldset}>
        <legend>Materias obligatorias</legend>
        {availableCourses.length === 0 && (
          <p>No hay materias registradas todavía.</p>
        )}
        {availableCourses.map((course) => (
          <label key={course.id} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={configuration.requiredCourses.includes(course.name)}
              onChange={() =>
                toggleCourseInList(course.name, "requiredCourses")
              }
            />
            {course.name}
          </label>
        ))}
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>Materias ya aprobadas (para prerrequisitos)</legend>
        {availableCourses.map((course) => (
          <label key={course.id} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={configuration.completedCourses.includes(course.name)}
              onChange={() =>
                toggleCourseInList(course.name, "completedCourses")
              }
            />
            {course.name}
          </label>
        ))}
      </fieldset>

      <button type="submit" disabled={submitting}>
        {submitting ? "Generando..." : "Generar horarios"}
      </button>
    </form>
  );
}