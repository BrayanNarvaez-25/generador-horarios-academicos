import type { Request, Response } from "express";
import { validateScheduleConfiguration } from "../services/scheduleConfigService.js";
import type { ScheduleConfiguration } from "../types/schedule.js";

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

    // A partir del siguiente paso (combinatoria), aquí generaremos
    // las combinaciones reales. Por ahora confirmamos que la
    // configuración es válida y lista para procesar.
    return res.status(200).json({
      message: "Configuración válida. Lista para generar combinaciones.",
      totalCoursesAvailable: validation.totalCoursesAvailable,
      configuration,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al procesar la configuración del horario.",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}