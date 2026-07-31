import { useState } from "react";
import { useCourses } from "../hooks/useCourses";
import { CourseForm } from "../components/CourseForm";
import { CourseList } from "../components/CourseList";
import { MathBadge } from "../components/MathBadge";
import {
  createCourse,
  updateCourse,
  deleteCourse,
} from "../services/courseService";
import type { Course, CourseInput } from "../types/course";

export function CoursesPage() {
  const { courses, loading, error, reloadCourses } = useCourses();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  async function handleCreate(data: CourseInput) {
    await createCourse(data);
    await reloadCourses();
  }

  async function handleUpdate(data: CourseInput) {
    if (!editingCourse) return;
    await updateCourse(editingCourse.id, data);
    setEditingCourse(null);
    await reloadCourses();
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar esta materia?"
    );
    if (!confirmed) return;

    try {
      await deleteCourse(id);
      await reloadCourses();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al eliminar la materia."
      );
    }
  }

  return (
    <div>
      <h2>Administración de materias</h2>
      <MathBadge notation="U = { materias }" label="Conjunto universal" />

      <CourseForm
        key={editingCourse?.id ?? "new"}
        initialData={editingCourse ?? undefined}
        onSubmit={editingCourse ? handleUpdate : handleCreate}
        onCancel={editingCourse ? () => setEditingCourse(null) : undefined}
      />

      {loading && <p>Cargando materias...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <CourseList
          courses={courses}
          onEdit={setEditingCourse}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}