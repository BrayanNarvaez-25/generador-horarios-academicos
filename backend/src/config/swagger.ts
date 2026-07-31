import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Generador Inteligente de Horarios Académicos",
      version: "1.0.0",
      description:
        "API para registrar materias y generar horarios académicos válidos aplicando teoría de conjuntos, álgebra proposicional y combinatoria.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
    tags: [
      { name: "Courses", description: "CRUD de materias" },
      { name: "Schedules", description: "Generación de horarios académicos" },
      {
        name: "Demos",
        description:
          "Endpoints de demostración conceptual (matemáticas discretas)",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);