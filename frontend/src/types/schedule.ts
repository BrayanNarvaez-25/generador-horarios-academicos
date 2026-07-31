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

export interface ScheduleEvaluation {
  valid: boolean;
  reasons: string[];
}

export interface EvaluatedSchedule {
  courses: string[];
  totalCredits: number;
  evaluation: ScheduleEvaluation;
}

export interface GenerateScheduleResponse {
  totalCourses: number;
  selectedAmount: number;
  totalCombinations: number;
  validSchedulesCount: number;
  discardedSchedulesCount: number;
  validSchedules: EvaluatedSchedule[];
  discardedSchedules: EvaluatedSchedule[];
}