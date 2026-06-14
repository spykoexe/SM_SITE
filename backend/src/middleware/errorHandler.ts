import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Données invalides",
      errors: err.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
    });
    return;
  }

  logger.error(err);

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Erreur interne du serveur" : err.message,
  });
}
