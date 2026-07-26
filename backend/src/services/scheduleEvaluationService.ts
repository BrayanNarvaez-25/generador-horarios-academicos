import type { CourseWithPrerequisites } from "../types/course.js";
import type { ScheduleConfiguration } from "../types/schedule.js";
import type { ScheduleEvaluation } from "../types/evaluation.js";
import { getCourseNameSet, includesRequiredCourses } from "./setService.js";
import {
  hasScheduleConflicts,
  meetsModalityRule,
  countDifficultCourses,
  calculateTotalCredits,
  meetsPrerequisites,
} from "./scheduleValidationService.js";

export function evaluateSchedule(
  schedule: CourseWithPrerequisites[],
  configuration: ScheduleConfiguration
): ScheduleEvaluation {
  const reasons: string[] = [];

  // T: Tiene la cantidad correcta de materias.
  if (schedule.length !== configuration.numberOfCourses) {
    reasons.push(
      `El horario tiene ${schedule.length} materias, pero se solicitaron ${configuration.numberOfCourses}.`
    );
  }

  // O: Incluye las materias obligatorias (subconjunto).
  const courseSet = getCourseNameSet(schedule);
  const requiredCoursesSet = new Set(configuration.requiredCourses);

  if (!includesRequiredCourses(courseSet, requiredCoursesSet)) {
    reasons.push("No contiene todas las materias obligatorias.");
  }

  // C: No tiene cruces de horario.
  if (
    configuration.avoidTimeConflicts &&
    hasScheduleConflicts(schedule)
  ) {
    reasons.push("El horario tiene cruces.");
  }

  // Modalidad: al menos una materia cumple la modalidad requerida.
  if (!meetsModalityRule(schedule, configuration.requiredModality)) {
    reasons.push(
      `No cumple la modalidad requerida (${configuration.requiredModality}).`
    );
  }

  // D: Cumple el máximo de materias difíciles.
  const difficultCount = countDifficultCourses(schedule);
  if (difficultCount > configuration.maximumDifficultCourses) {
    reasons.push(
      `Supera el máximo de materias difíciles (tiene ${difficultCount}, máximo permitido ${configuration.maximumDifficultCourses}).`
    );
  }

  // R: Cumple el máximo de créditos.
  const totalCredits = calculateTotalCredits(schedule);
  if (totalCredits > configuration.maximumCredits) {
    reasons.push(
      `Supera el máximo de créditos (tiene ${totalCredits}, máximo permitido ${configuration.maximumCredits}).`
    );
  }

  // U: Cumple los prerrequisitos.
  if (
    configuration.validatePrerequisites &&
    !meetsPrerequisites(schedule, configuration.completedCourses)
  ) {
    reasons.push("No cumple los prerrequisitos de una o más materias.");
  }

  return {
    valid: reasons.length === 0,
    reasons,
  };
}