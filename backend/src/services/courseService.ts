import { prisma } from "../config/prisma.js";
import type { CourseWithPrerequisites } from "../types/course.js";

interface CourseInput {
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  modality: string;
  difficulty: string;
  credits: number;
}

export async function createCourse(data: CourseInput) {
  return prisma.course.create({ data });
}

export async function getAllCourses(): Promise<CourseWithPrerequisites[]> {
  return prisma.course.findMany({
    include: {
      requiredPrerequisites: {
        include: { prerequisiteCourse: true },
      },
    },
  });
}

export async function getCourseById(id: number) {
  return prisma.course.findUnique({
    where: { id },
    include: {
      requiredPrerequisites: {
        include: { prerequisiteCourse: true },
      },
    },
  });
}

export async function updateCourse(id: number, data: Partial<CourseInput>) {
  return prisma.course.update({
    where: { id },
    data,
  });
}

export async function deleteCourse(id: number) {
  return prisma.course.delete({
    where: { id },
  });
}