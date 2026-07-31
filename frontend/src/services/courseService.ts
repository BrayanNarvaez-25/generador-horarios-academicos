import { apiFetch } from "./api";
import type { Course, CourseInput } from "../types/course";

export function getAllCourses(): Promise<Course[]> {
  return apiFetch<Course[]>("/courses");
}

export function getCourseById(id: number): Promise<Course> {
  return apiFetch<Course>(`/courses/${id}`);
}

export function createCourse(data: CourseInput): Promise<Course> {
  return apiFetch<Course>("/courses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCourse(
  id: number,
  data: Partial<CourseInput>
): Promise<Course> {
  return apiFetch<Course>(`/courses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteCourse(id: number): Promise<void> {
  return apiFetch<void>(`/courses/${id}`, {
    method: "DELETE",
  });
}