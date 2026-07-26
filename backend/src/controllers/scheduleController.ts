import type { Request, Response } from "express";
import { validateScheduleConfiguration } from "../services/scheduleConfigService.js";
import { getAllCourses } from "../services/courseService.js";
import {
  calculateCombinationCount,
  generateCombinations,
} from "../services/combinatoricsService.js";
import type { ScheduleConfiguration } from "../types/schedule.js";
import { getCourseNameSet, includesRequiredCourses } from "../services/setService.js";
import {
  hasScheduleConflicts,
  meetsModalityRule,
  countDifficultCourses,
  meetsDifficultyRule,
  calculateTotalCredits,
  meetsCreditLimit,
} from "../services/scheduleValidationService.js";
import { meetsPrerequisites } from "../services/scheduleValidationService.js";

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

export async function handleConflictsDemo(req: Request, res: Response) {
  try {
    const allCourses = await getAllCourses();

    if (allCourses.length < 2) {
      return res.status(400).json({
        message: "Se necesitan al menos 2 materias para probar cruces.",
      });
    }

    // Tomamos todas las materias disponibles como ejemplo de horario completo.
    const hasConflicts = hasScheduleConflicts(allCourses);

    return res.status(200).json({
      message: "Demostración de detección de cruces de horario.",
      courses: allCourses.map((course) => ({
        name: course.name,
        day: course.day,
        startTime: course.startTime,
        endTime: course.endTime,
      })),
      "¿El conjunto de materias tiene cruces?": hasConflicts,
      "¿El horario NO tiene cruces (¬P)?": !hasConflicts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al generar la demostración.",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}

export async function handleModalityDemo(req: Request, res: Response) {
  try {
    const allCourses = await getAllCourses();

    if (allCourses.length === 0) {
      return res.status(400).json({
        message: "No hay materias registradas para hacer la demostración.",
      });
    }

    const requiredModality = (req.query["modality"] as string) || "Cualquiera";

    if (!["Cualquiera", "Presencial", "Virtual"].includes(requiredModality)) {
      return res.status(400).json({
        message:
          "El parámetro 'modality' debe ser: Cualquiera, Presencial o Virtual.",
      });
    }

    const meetsRule = meetsModalityRule(
      allCourses,
      requiredModality as "Cualquiera" | "Presencial" | "Virtual"
    );

    return res.status(200).json({
      message: "Demostración de validación de modalidad.",
      requiredModality,
      courses: allCourses.map((course) => ({
        name: course.name,
        modality: course.modality,
      })),
      "¿Cumple la regla de modalidad?": meetsRule,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al generar la demostración.",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}

export async function handleDifficultyAndCreditsDemo(
  req: Request,
  res: Response
) {
  try {
    const allCourses = await getAllCourses();

    if (allCourses.length === 0) {
      return res.status(400).json({
        message: "No hay materias registradas para hacer la demostración.",
      });
    }

    const maximumDifficultCourses = Number(
      req.query["maxDifficult"] ?? "2"
    );
    const maximumCredits = Number(req.query["maxCredits"] ?? "12");

    const difficultCount = countDifficultCourses(allCourses);
    const totalCredits = calculateTotalCredits(allCourses);

    return res.status(200).json({
      message: "Demostración de validación de dificultad y créditos.",
      courses: allCourses.map((course) => ({
        name: course.name,
        difficulty: course.difficulty,
        credits: course.credits,
      })),
      dificultad: {
        maximoPermitido: maximumDifficultCourses,
        cantidadEnHorario: difficultCount,
        "¿Cumple la regla de dificultad?": meetsDifficultyRule(
          allCourses,
          maximumDifficultCourses
        ),
      },
      creditos: {
        maximoPermitido: maximumCredits,
        totalEnHorario: totalCredits,
        "¿Cumple el límite de créditos?": meetsCreditLimit(
          allCourses,
          maximumCredits
        ),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al generar la demostración.",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}

export async function handlePrerequisitesDemo(req: Request, res: Response) {
  try {
    const allCourses = await getAllCourses();

    if (allCourses.length === 0) {
      return res.status(400).json({
        message: "No hay materias registradas para hacer la demostración.",
      });
    }

    const completedCoursesParam = req.query["completed"] as string | undefined;
    const completedCourseNames = completedCoursesParam
      ? completedCoursesParam.split(",")
      : [];

    const meetsRule = meetsPrerequisites(allCourses, completedCourseNames);

    return res.status(200).json({
      message: "Demostración de validación de prerrequisitos.",
      completedCourseNames,
      courses: allCourses.map((course) => ({
        name: course.name,
        prerequisites: course.requiredPrerequisites.map(
          (prerequisite) => prerequisite.prerequisiteCourse.name
        ),
      })),
      "¿Se cumplen todos los prerrequisitos?": meetsRule,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al generar la demostración.",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}