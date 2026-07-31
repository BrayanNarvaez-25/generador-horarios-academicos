import { Router } from "express";
import {
  handleCreateCourse,
  handleGetAllCourses,
  handleGetCourseById,
  handleUpdateCourse,
  handleDeleteCourse,
} from "../controllers/courseController.js";

export const courseRoutes = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     CourseInput:
 *       type: object
 *       required:
 *         - name
 *         - day
 *         - startTime
 *         - endTime
 *         - modality
 *         - difficulty
 *         - credits
 *       properties:
 *         name:
 *           type: string
 *           example: Programación
 *         day:
 *           type: string
 *           example: Lunes
 *         startTime:
 *           type: string
 *           example: "08:00"
 *         endTime:
 *           type: string
 *           example: "10:00"
 *         modality:
 *           type: string
 *           enum: [Presencial, Virtual]
 *           example: Presencial
 *         difficulty:
 *           type: string
 *           enum: [Baja, Media, Alta]
 *           example: Alta
 *         credits:
 *           type: integer
 *           example: 4
 */

/**
 * @openapi
 * /courses:
 *   post:
 *     tags: [Courses]
 *     summary: Registrar una nueva materia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseInput'
 *     responses:
 *       201:
 *         description: Materia creada exitosamente
 *       400:
 *         description: Faltan campos obligatorios
 *   get:
 *     tags: [Courses]
 *     summary: Listar todas las materias disponibles
 *     responses:
 *       200:
 *         description: Lista de materias con sus prerrequisitos
 */
courseRoutes.post("/", handleCreateCourse);
courseRoutes.get("/", handleGetAllCourses);

/**
 * @openapi
 * /courses/{id}:
 *   get:
 *     tags: [Courses]
 *     summary: Obtener una materia por id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Materia encontrada
 *       404:
 *         description: Materia no encontrada
 *   put:
 *     tags: [Courses]
 *     summary: Actualizar una materia existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseInput'
 *     responses:
 *       200:
 *         description: Materia actualizada
 *   delete:
 *     tags: [Courses]
 *     summary: Eliminar una materia
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Materia eliminada exitosamente
 */
courseRoutes.get("/:id", handleGetCourseById);
courseRoutes.put("/:id", handleUpdateCourse);
courseRoutes.delete("/:id", handleDeleteCourse);