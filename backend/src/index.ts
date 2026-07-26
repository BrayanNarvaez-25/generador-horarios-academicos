import express from "express";
import { prisma } from "./config/prisma.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente 🚀" });
});

app.get("/test-db", async (req, res) => {
  try {
    const courseCount = await prisma.course.count();
    res.json({
      message: "Conexión a la base de datos exitosa ✅",
      totalCourses: courseCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al conectar con la base de datos ❌",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});