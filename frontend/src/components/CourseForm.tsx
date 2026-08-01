import { useState, useEffect } from "react";
import type { CourseInput, Course } from "../types/course";
import styles from "./CourseForm.module.css";

interface CourseFormProps {
  initialData?: Course;
  availableCourses: Course[];
  onSubmit: (data: CourseInput) => Promise<void>;
  onCancel?: () => void;
}

const emptyForm: CourseInput = {
  name: "",
  day: "Lunes",
  startTime: "08:00",
  endTime: "10:00",
  modality: "Presencial",
  difficulty: "Media",
  credits: 3,
  prerequisiteIds: [],
};

export function CourseForm({
  initialData,
  availableCourses,
  onSubmit,
  onCancel,
}: CourseFormProps) {
  const [formData, setFormData] = useState<CourseInput>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        day: initialData.day,
        startTime: initialData.startTime,
        endTime: initialData.endTime,
        modality: initialData.modality,
        difficulty: initialData.difficulty,
        credits: initialData.credits,
        prerequisiteIds: initialData.requiredPrerequisites.map(
          (p) => p.prerequisiteCourseId
        ),
      });
    }
  }, [initialData]);

  function togglePrerequisite(courseId: number) {
    setFormData((prev) => {
      const alreadyIncluded = prev.prerequisiteIds.includes(courseId);
      return {
        ...prev,
        prerequisiteIds: alreadyIncluded
          ? prev.prerequisiteIds.filter((id) => id !== courseId)
          : [...prev.prerequisiteIds, courseId],
      };
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
      if (!initialData) {
        setFormData(emptyForm);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSubmitting(false);
    }
  }

  // Una materia no puede ser prerrequisito de sí misma.
  const selectableCourses = availableCourses.filter(
    (course) => course.id !== initialData?.id
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>{initialData ? "Editar materia" : "Registrar nueva materia"}</h3>

      {error && <p className={styles.error}>{error}</p>}

      <label>
        Nombre
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </label>

      <label>
        Día
        <select
          value={formData.day}
          onChange={(e) => setFormData({ ...formData, day: e.target.value })}
        >
          {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map(
            (day) => (
              <option key={day} value={day}>
                {day}
              </option>
            )
          )}
        </select>
      </label>

      <div className={styles.row}>
        <label>
          Hora inicio
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
            required
          />
        </label>

        <label>
          Hora fin
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
            required
          />
        </label>
      </div>

      <label>
        Modalidad
        <select
          value={formData.modality}
          onChange={(e) =>
            setFormData({ ...formData, modality: e.target.value })
          }
        >
          <option value="Presencial">Presencial</option>
          <option value="Virtual">Virtual</option>
        </select>
      </label>

      <label>
        Dificultad
        <select
          value={formData.difficulty}
          onChange={(e) =>
            setFormData({ ...formData, difficulty: e.target.value })
          }
        >
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>
      </label>

      <label>
        Créditos
        <input
          type="number"
          min={1}
          value={formData.credits}
          onChange={(e) =>
            setFormData({ ...formData, credits: Number(e.target.value) })
          }
          required
        />
      </label>

      <fieldset className={styles.fieldset}>
        <legend>Prerrequisitos</legend>
        {selectableCourses.length === 0 && (
          <p>No hay otras materias registradas todavía.</p>
        )}
        {selectableCourses.map((course) => (
          <label key={course.id} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={formData.prerequisiteIds.includes(course.id)}
              onChange={() => togglePrerequisite(course.id)}
            />
            {course.name}
          </label>
        ))}
      </fieldset>

      <div className={styles.actions}>
        <button type="submit" disabled={submitting}>
          {submitting ? "Guardando..." : "Guardar"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={submitting}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}