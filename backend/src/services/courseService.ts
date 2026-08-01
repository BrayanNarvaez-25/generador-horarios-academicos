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
  prerequisiteIds?: number[];
}

export async function createCourse(
  data: CourseInput
): Promise<CourseWithPrerequisites> {
  const { prerequisiteIds, ...courseData } = data;

  const course = await prisma.course.create({
    data: courseData,
  });

  if (prerequisiteIds && prerequisiteIds.length > 0) {
    await prisma.prerequisite.createMany({
      data: prerequisiteIds.map((prerequisiteCourseId) => ({
        courseId: course.id,
        prerequisiteCourseId,
      })),
    });
  }

  return getCourseById(course.id) as Promise<CourseWithPrerequisites>;
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

export async function getCourseById(
  id: number
): Promise<CourseWithPrerequisites | null> {
  return prisma.course.findUnique({
    where: { id },
    include: {
      requiredPrerequisites: {
        include: { prerequisiteCourse: true },
      },
    },
  });
}

export async function updateCourse(
  id: number,
  data: Partial<CourseInput>
): Promise<CourseWithPrerequisites> {
  const { prerequisiteIds, ...courseData } = data;

  await prisma.course.update({
    where: { id },
    data: courseData,
  });

  if (prerequisiteIds !== undefined) {
    await prisma.prerequisite.deleteMany({ where: { courseId: id } });

    if (prerequisiteIds.length > 0) {
      await prisma.prerequisite.createMany({
        data: prerequisiteIds.map((prerequisiteCourseId) => ({
          courseId: id,
          prerequisiteCourseId,
        })),
      });
    }
  }

  return getCourseById(id) as Promise<CourseWithPrerequisites>;
}

export async function deleteCourse(id: number) {
  return prisma.course.delete({
    where: { id },
  });
}