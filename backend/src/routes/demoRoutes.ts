import { Router } from "express";
import {
  handleSetConceptsDemo,
  handleConflictsDemo,
  handleModalityDemo,
  handleDifficultyAndCreditsDemo,
  handlePrerequisitesDemo,
} from "../controllers/scheduleController.js";

export const demoRoutes = Router();

/**
 * @openapi
 * /schedules/demos/set-concepts:
 *   get:
 *     tags: [Demos]
 *     summary: Demostración de pertenencia, cardinalidad y subconjunto
 *     responses:
 *       200:
 *         description: Resultado de la demostración de conjuntos
 */
demoRoutes.get("/set-concepts", handleSetConceptsDemo);

/**
 * @openapi
 * /schedules/demos/conflicts:
 *   get:
 *     tags: [Demos]
 *     summary: Demostración de detección de cruces de horario
 *     responses:
 *       200:
 *         description: Resultado de la demostración de cruces
 */
demoRoutes.get("/conflicts", handleConflictsDemo);

/**
 * @openapi
 * /schedules/demos/modality:
 *   get:
 *     tags: [Demos]
 *     summary: Demostración de validación de modalidad (disyunción lógica)
 *     parameters:
 *       - in: query
 *         name: modality
 *         schema:
 *           type: string
 *           enum: [Cualquiera, Presencial, Virtual]
 *     responses:
 *       200:
 *         description: Resultado de la demostración de modalidad
 */
demoRoutes.get("/modality", handleModalityDemo);

/**
 * @openapi
 * /schedules/demos/difficulty-credits:
 *   get:
 *     tags: [Demos]
 *     summary: Demostración de validación de dificultad y créditos
 *     parameters:
 *       - in: query
 *         name: maxDifficult
 *         schema:
 *           type: integer
 *       - in: query
 *         name: maxCredits
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resultado de la demostración de dificultad y créditos
 */
demoRoutes.get("/difficulty-credits", handleDifficultyAndCreditsDemo);

/**
 * @openapi
 * /schedules/demos/prerequisites:
 *   get:
 *     tags: [Demos]
 *     summary: Demostración de validación de prerrequisitos (implicación lógica)
 *     parameters:
 *       - in: query
 *         name: completed
 *         schema:
 *           type: string
 *         description: Nombres de materias ya aprobadas, separados por coma
 *     responses:
 *       200:
 *         description: Resultado de la demostración de prerrequisitos
 */
demoRoutes.get("/prerequisites", handlePrerequisitesDemo);