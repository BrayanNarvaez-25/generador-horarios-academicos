import express from "express";
import { courseRoutes } from "./routes/courseRoutes.js";
import { scheduleRoutes } from "./routes/scheduleRoutes.js";
import { demoRoutes } from "./routes/demoRoutes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente 🚀" });
});

app.use("/courses", courseRoutes);
app.use("/schedules", scheduleRoutes);
app.use("/schedules/demos", demoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});