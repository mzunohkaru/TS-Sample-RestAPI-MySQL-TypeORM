import { Request, Response, NextFunction } from "express";
import { QueryFailedError } from "typeorm";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let statusCode = 500;
  let message = "Internal server error";
  let details: any = undefined;

  if (error instanceof CustomError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof QueryFailedError) {
    statusCode = 400;
    message = "Database query failed";

    if (error.driverError?.code === "ER_DUP_ENTRY") {
      statusCode = 409;
      message = "Duplicate entry found";
    }
  } else if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid data format";
  } else if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  if (process.env.NODE_ENV === "development") {
    details = {
      stack: error.stack,
      name: error.name,
    };
  }

  console.error("Error:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const error = new CustomError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
