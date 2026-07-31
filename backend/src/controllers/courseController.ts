import type { Request, Response } from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../services/courseService.js";

export async function handleCreateCourse(req: Request, res: Response) {
  try {
    const { name, day, startTime, endTime, modality, difficulty, credits } =
      req.body;

    if (
      !name ||
      !day ||
      !startTime ||
      !endTime ||
      !modality ||
      !difficulty ||
      credits === undefined
    ) {
      return res.status(400).json({
        message: "Faltan campos obligatorios para registrar la materia.",
      });
    }

    const course = await createCourse({
      name,
      day,
      startTime,
      endTime,
      modality,
      difficulty,
      credits,
    });

    return res.status(201).json(course);
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear la materia.",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}

export async function handleGetAllCourses(req: Request, res: Response) {
  try {
    const courses = await getAllCourses();
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener las materias.",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}

export async function handleGetCourseById(req: Request, res: Response) {
  try {
    const id = Number(req.params["id"]);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "El id debe ser un número." });
    }

    const course = await getCourseById(id);

    if (!course) {
      return res.status(404).json({ message: "Materia no encontrada." });
    }

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener la materia.",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}

export async function handleUpdateCourse(req: Request, res: Response) {
  try {
    const id = Number(req.params["id"]);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "El id debe ser un número." });
    }

    const course = await updateCourse(id, req.body);
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar la materia.",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}

export async function handleDeleteCourse(req: Request, res: Response) {
  try {
    const id = Number(req.params["id"]);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "El id debe ser un número." });
    }

    await deleteCourse(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      message:
        "Error al eliminar la materia. Verifica que no tenga relaciones que lo impidan.",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}