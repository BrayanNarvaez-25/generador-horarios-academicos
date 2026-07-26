import express from "express";
import { courseRoutes } from "./routes/courseRoutes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente 🚀" });
});

app.use("/courses", courseRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});