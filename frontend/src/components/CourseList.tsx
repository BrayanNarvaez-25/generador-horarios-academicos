import type { Course } from "../types/course";
import styles from "./CourseList.module.css";

interface CourseListProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (id: number) => void;
}

export function CourseList({ courses, onEdit, onDelete }: CourseListProps) {
  if (courses.length === 0) {
    return <p>No hay materias registradas todavía.</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Día</th>
          <th>Horario</th>
          <th>Modalidad</th>
          <th>Dificultad</th>
          <th>Créditos</th>
          <th>Prerrequisitos</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course.id}>
            <td>{course.name}</td>
            <td>{course.day}</td>
            <td>
              {course.startTime} - {course.endTime}
            </td>
            <td>{course.modality}</td>
            <td>{course.difficulty}</td>
            <td>{course.credits}</td>
            <td>
              {course.requiredPrerequisites.length === 0
                ? "—"
                : course.requiredPrerequisites
                    .map((p) => p.prerequisiteCourse.name)
                    .join(", ")}
            </td>
            <td>
              <button onClick={() => onEdit(course)}>Editar</button>
              <button onClick={() => onDelete(course.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}