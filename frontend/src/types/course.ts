export interface Prerequisite {
  courseId: number;
  prerequisiteCourseId: number;
  prerequisiteCourse: {
    id: number;
    name: string;
  };
}

export interface Course {
  id: number;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  modality: string;
  difficulty: string;
  credits: number;
  requiredPrerequisites: Prerequisite[];
}

export interface CourseInput {
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  modality: string;
  difficulty: string;
  credits: number;
  prerequisiteIds: number[];
}