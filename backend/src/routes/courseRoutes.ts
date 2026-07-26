import { Router } from "express";
import {
  handleCreateCourse,
  handleGetAllCourses,
  handleGetCourseById,
  handleUpdateCourse,
  handleDeleteCourse,
} from "../controllers/courseController.js";

export const courseRoutes = Router();

courseRoutes.post("/", handleCreateCourse);
courseRoutes.get("/", handleGetAllCourses);
courseRoutes.get("/:id", handleGetCourseById);
courseRoutes.put("/:id", handleUpdateCourse);
courseRoutes.delete("/:id", handleDeleteCourse);