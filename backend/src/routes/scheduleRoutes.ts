import { Router } from "express";
import { handleGenerateSchedule } from "../controllers/scheduleController.js";

export const scheduleRoutes = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     ScheduleConfiguration:
 *       type: object
 *       required:
 *         - numberOfCourses
 *         - requiredCourses
 *         - maximumCredits
 *         - maximumDifficultCourses
 *         - requiredModality
 *         - avoidTimeConflicts
 *         - validatePrerequisites
 *       properties:
 *         numberOfCourses:
 *           type: integer
 *           example: 3
 *         requiredCourses:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Programación"]
 *         maximumCredits:
 *           type: integer
 *           example: 12
 *         maximumDifficultCourses:
 *           type: integer
 *           example: 2
 *         requiredModality:
 *           type: string
 *           enum: [Cualquiera, Presencial, Virtual]
 *           example: Cualquiera
 *         avoidTimeConflicts:
 *           type: boolean
 *           example: true
 *         validatePrerequisites:
 *           type: boolean
 *           example: true
 *         completedCourses:
 *           type: array
 *           items:
 *             type: string
 *           example: []
 */

/**
 * @openapi
 * /schedules/generate:
 *   post:
 *     tags: [Schedules]
 *     summary: Generar todos los horarios posibles según la configuración
 *     description: >
 *       Aplica combinatoria para generar todas las combinaciones posibles de materias,
 *       teoría de conjuntos para representar cada horario, y álgebra proposicional
 *       para validar cada combinación (cruces, modalidad, dificultad, créditos y prerrequisitos).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScheduleConfiguration'
 *     responses:
 *       200:
 *         description: Horarios generados, separados en válidos y descartados
 *       400:
 *         description: Configuración inválida (faltan campos o no hay suficientes materias)
 */
scheduleRoutes.post("/generate", handleGenerateSchedule);