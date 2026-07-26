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

export function hasOnSiteCourse(schedule: Course[]): boolean {
  return schedule.some((course) => course.modality === "Presencial");
}

export function hasVirtualCourse(schedule: Course[]): boolean {
  return schedule.some((course) => course.modality === "Virtual");
}

export function meetsModalityRule(
  schedule: Course[],
  requiredModality: "Cualquiera" | "Presencial" | "Virtual"
): boolean {
  if (requiredModality === "Cualquiera") {
    return true;
  }

  if (requiredModality === "Presencial") {
    return hasOnSiteCourse(schedule);
  }

  return hasVirtualCourse(schedule);
}

export function countDifficultCourses(schedule: Course[]): number {
  return schedule.filter((course) => course.difficulty === "Alta").length;
}

export function meetsDifficultyRule(
  schedule: Course[],
  maximumDifficultCourses: number
): boolean {
  return countDifficultCourses(schedule) <= maximumDifficultCourses;
}

export function calculateTotalCredits(schedule: Course[]): number {
  return schedule.reduce((total, course) => total + course.credits, 0);
}

export function meetsCreditLimit(
  schedule: Course[],
  maximumCredits: number
): boolean {
  return calculateTotalCredits(schedule) <= maximumCredits;
}