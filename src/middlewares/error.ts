import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/http";
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.error(`[${req.method}] ${req.path}`, err.message);
  if (err instanceof ZodError)
    return void res
      .status(400)
      .json({ error: "Validation error", details: err.flatten() });
  const status = err instanceof AppError ? err.status : 500;
  res
    .status(status)
    .json({
      error:
        err instanceof AppError || process.env.NODE_ENV !== "production"
          ? err.message
          : "Internal server error",
    });
};
