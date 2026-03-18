import cors from "cors";
import express from "express";
import pinoHttpModule from "pino-http";
import { logger } from "./lib/logger.js";
import { healthRouter } from "./routes/health.js";
import { reportsRouter } from "./routes/reports.js";

const pinoHttp = typeof pinoHttpModule === "function" ? pinoHttpModule : pinoHttpModule.default;

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(pinoHttp({ logger }));

  app.use("/health", healthRouter);
  app.use("/api/v1", reportsRouter);

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = error instanceof Error ? error.message : "Unknown server error";
    logger.error({ err: error }, "Unhandled request error");
    res.status(500).json({
      permission_required: false,
      message,
      language: "en",
      data: {}
    });
  });

  return app;
}
