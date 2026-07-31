import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { courseRoutes } from "./routes/courseRoutes.js";
import { scheduleRoutes } from "./routes/scheduleRoutes.js";
import { demoRoutes } from "./routes/demoRoutes.js";
import { swaggerSpec } from "./config/swagger.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente 🚀" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/courses", courseRoutes);
app.use("/schedules", scheduleRoutes);
app.use("/schedules/demos", demoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});