import type { Course } from "../generated/prisma/client.js";

export function getCourseNameSet(schedule: Course[]): Set<string> {
  return new Set(schedule.map((course) => course.name));
}

export function includesRequiredCourses(
  scheduleSet: Set<string>,
  requiredCoursesSet: Set<string>
): boolean {
  return [...requiredCoursesSet].every((course) => scheduleSet.has(course));
}

export function isSubset<T>(subset: Set<T>, mainSet: Set<T>): boolean {
  return [...subset].every((element) => mainSet.has(element));
}