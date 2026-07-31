import { Router } from "express";
import {
  handleSetConceptsDemo,
  handleConflictsDemo,
  handleModalityDemo,
  handleDifficultyAndCreditsDemo,
  handlePrerequisitesDemo,
} from "../controllers/scheduleController.js";

export const demoRoutes = Router();

demoRoutes.get("/set-concepts", handleSetConceptsDemo);
demoRoutes.get("/conflicts", handleConflictsDemo);
demoRoutes.get("/modality", handleModalityDemo);
demoRoutes.get("/difficulty-credits", handleDifficultyAndCreditsDemo);
demoRoutes.get("/prerequisites", handlePrerequisitesDemo);