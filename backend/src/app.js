import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import env from "./config/env.js";
import requestId from "./middleware/requestId.middleware.js";
import healthRoutes from "./routes/health.routes.js";

import investigationRoutes
  from "./routes/investigation.routes.js";

import authRoutes from "./routes/auth.routes.js";

import dashboardRoutes
  from "./routes/dashboard.routes.js";

import transactionRoutes
  from "./routes/transaction.routes.js";

import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(requestId);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

app.use("/api/v1/health", healthRoutes);

app.use(
  "/api/v1/investigations",
  investigationRoutes
);

app.use(
  "/api/v1/auth",
  authRoutes
);

app.use(
  "/api/v1/dashboard",
  dashboardRoutes
);

app.use(
  "/api/v1/transactions",
  transactionRoutes
);

app.use(errorMiddleware);

export default app;