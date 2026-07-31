import { useState, useEffect, useCallback } from "react";
import type { Course } from "../types/course";
import { getAllCourses } from "../services/courseService";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return { courses, loading, error, reloadCourses: loadCourses };
}