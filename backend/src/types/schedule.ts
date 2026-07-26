export interface ScheduleConfiguration {
  numberOfCourses: number;
  requiredCourses: string[];
  maximumCredits: number;
  maximumDifficultCourses: number;
  requiredModality: "Cualquiera" | "Presencial" | "Virtual";
  avoidTimeConflicts: boolean;
  validatePrerequisites: boolean;
  completedCourses: string[];
}