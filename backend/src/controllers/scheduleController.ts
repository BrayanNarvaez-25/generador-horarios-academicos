import type { Request, Response } from "express";
import { validateScheduleConfiguration } from "../services/scheduleConfigService.js";
import { getAllCourses } from "../services/courseService.js";
import {
  calculateCombinationCount,
  generateCombinations,
} from "../services/combinatoricsService.js";
import type { ScheduleConfiguration } from "../types/schedule.js";
import { getCourseNameSet, includesRequiredCourses } from "../services/setService.js";

export async function handleGenerateSchedule(req: Request, res: Response) {
  try {
    const configuration = req.body as ScheduleConfiguration;

    const requiredFields: Array<keyof ScheduleConfiguration> = [
      "numberOfCourses",
      "requiredCourses",
      "maximumCredits",
      "maximumDifficultCourses",
      "requiredModality",
      "avoidTimeConflicts",
      "validatePrerequisites",
    ];

    const missingFields = requiredFields.filter(
      (field) => configuration[field] === undefined
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Faltan campos obligatorios en la configuración.",
        missingFields,
      });
    }

    const validation = await validateScheduleConfiguration(configuration);

    if (!validation.valid) {
      return res.status(400).json({
        message: "La configuración del horario no es válida.",
        errors: validation.errors,
      });
    }

    const allCourses = await getAllCourses();

    const totalCombinations = calculateCombinationCount(
      allCourses.length,
      configuration.numberOfCourses
    );

    const possibleSchedules = generateCombinations(
      allCourses,
      configuration.numberOfCourses
    );

    // Nota: en el siguiente paso vamos a evaluar cada combinación
    // (conjuntos, reglas lógicas, cruces, etc.). Por ahora solo
    // confirmamos que la generación matemática coincide con la fórmula.
    return res.status(200).json({
      message: "Combinaciones generadas correctamente.",
      totalCoursesAvailable: allCourses.length,
      coursesPerSchedule: configuration.numberOfCourses,
      totalCombinations,
      generatedCombinationsCount: possibleSchedules.length,
      schedulesPreview: possibleSchedules
        .slice(0, 3)
        .map((schedule) => schedule.map((course) => course.name)),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al procesar la configuración del horario.",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}

export async function handleSetConceptsDemo(req: Request, res: Response) {
  try {
    const allCourses = await getAllCourses();

    if (allCourses.length === 0) {
      return res.status(400).json({
        message: "No hay materias registradas para hacer la demostración.",
      });
    }

    // Tomamos las primeras 2 materias como ejemplo de "horario".
    const sampleSchedule = allCourses.slice(0, 2);
    const courseSet = getCourseNameSet(sampleSchedule);

    const requiredCourses = new Set(["Programación"]);
    const hasRequired = includesRequiredCourses(courseSet, requiredCourses);

    return res.status(200).json({
      message: "Demostración de conceptos de conjuntos.",
      scheduleAsArray: [...courseSet],
      cardinality: courseSet.size,
      pertenencia: {
        "¿Programación pertenece al horario?": courseSet.has("Programación"),
        "¿Diseño pertenece al horario?": courseSet.has("Diseño"),
      },
      subconjunto: {
        materiasObligatorias: [...requiredCourses],
        "¿El horario incluye todas las materias obligatorias?": hasRequired,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al generar la demostración.",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}