import { Router } from "express";
import { handleGenerateSchedule } from "../controllers/scheduleController.js";

export const scheduleRoutes = Router();

scheduleRoutes.post("/generate", handleGenerateSchedule);