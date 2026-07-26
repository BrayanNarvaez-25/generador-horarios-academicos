import type { Course } from "../generated/prisma/client.js";

export function haveTimeConflict(courseA: Course, courseB: Course): boolean {
  if (courseA.day !== courseB.day) {
    return false;
  }

  return (
    courseA.startTime < courseB.endTime && courseB.startTime < courseA.endTime
  );
}

export function hasScheduleConflicts(courses: Course[]): boolean {
  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      const courseA = courses[i] as Course;
      const courseB = courses[j] as Course;

      if (haveTimeConflict(courseA, courseB)) {
        return true;
      }
    }
  }

  return false;
}