import { Request, Response, NextFunction } from "express";

import AppError from "../errors/app";
import logger from "../services/winston";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError("Invalid API Request!", 404);
  next(error);
};

export const serverError = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  // Log the error
  if (!err.statusCode || err.statusCode === 500) {
    logger.error("Error", {
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      error: err.message,
      stack: err.stack,
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).send({ message });
};
