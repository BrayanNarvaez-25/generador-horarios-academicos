import { Router } from "express";
import {
  handleGenerateSchedule,
  handleSetConceptsDemo,
  handleConflictsDemo,
} from "../controllers/scheduleController.js";

export const scheduleRoutes = Router();

scheduleRoutes.post("/generate", handleGenerateSchedule);
scheduleRoutes.get("/set-concepts-demo", handleSetConceptsDemo);
scheduleRoutes.get("/conflicts-demo", handleConflictsDemo);