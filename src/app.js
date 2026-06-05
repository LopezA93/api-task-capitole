import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";

import swaggerDoc from "../swagger.json" with { type: "json" };

const app = express();
app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));

const origins = ["http://localhost:5173", "https://task-capitole.vercel.app"];

app.use(cors({ origin: origins }));

app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use("/", apiLimiter);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);

app.get("/", (_req, res) =>
  res.json({ success: true, message: "Hello! - Task API" }),
);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "404 not found" });
});

app.use(errorHandler);

export default app;
