import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.type === "field" ? error.path : "unknown",
      message: error.msg,
      value: error.type === "field" ? error.value : undefined,
    }));

    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors,
    });
    return;
  }

  next();
};
