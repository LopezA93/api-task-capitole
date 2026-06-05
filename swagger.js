import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Task API",
    description:
      "API REST de gestión de tareas con autenticación JWT y roles (admin / user).",
    version: "1.0.0",
  },
  host: "localhost:8087",
  schemes: ["http", "https"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description: "Bearer <accessToken>",
    },
  },
};

const outputFile = "./swagger.json";
const routes = ["./src/app.js"];

swaggerAutogen()(outputFile, routes, doc);
