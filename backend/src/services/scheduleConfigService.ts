import { getAllCourses } from "./courseService.js";
import type { ScheduleConfiguration } from "../types/schedule.js";

interface ConfigValidationResult {
  valid: boolean;
  errors: string[];
  totalCoursesAvailable: number;
}

export async function validateScheduleConfiguration(
  configuration: ScheduleConfiguration
): Promise<ConfigValidationResult> {
  const errors: string[] = [];

  const allCourses = await getAllCourses();
  const totalCoursesAvailable = allCourses.length;

  // Regla: la cantidad de materias solicitadas no puede superar
  // la cantidad de materias registradas en el sistema (punto 25 del PDF).
  if (configuration.numberOfCourses > totalCoursesAvailable) {
    errors.push(
      `No existen suficientes materias disponibles. Se solicitaron ${configuration.numberOfCourses} materias, pero solo hay ${totalCoursesAvailable} registradas.`
    );
  }

  if (configuration.numberOfCourses <= 0) {
    errors.push("La cantidad de materias debe ser mayor a cero.");
  }

  // Regla: las materias obligatorias deben existir dentro del conjunto universal.
  const availableCourseNames = new Set(
    allCourses.map((course) => course.name)
  );

  const missingRequiredCourses = configuration.requiredCourses.filter(
    (courseName) => !availableCourseNames.has(courseName)
  );

  if (missingRequiredCourses.length > 0) {
    errors.push(
      `Las siguientes materias obligatorias no existen en el sistema: ${missingRequiredCourses.join(", ")}.`
    );
  }

  // Regla: no se pueden pedir más materias obligatorias que el tamaño del horario.
  if (configuration.requiredCourses.length > configuration.numberOfCourses) {
    errors.push(
      "La cantidad de materias obligatorias no puede ser mayor que la cantidad total de materias del horario."
    );
  }

  if (configuration.maximumCredits <= 0) {
    errors.push("El máximo de créditos debe ser mayor a cero.");
  }

  if (configuration.maximumDifficultCourses < 0) {
    errors.push(
      "El máximo de materias difíciles no puede ser un número negativo."
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    totalCoursesAvailable,
  };
}