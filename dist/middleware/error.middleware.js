"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = exports.CustomError = void 0;
const typeorm_1 = require("typeorm");
class CustomError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
const errorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal server error';
    let details = undefined;
    if (error instanceof CustomError) {
        statusCode = error.statusCode;
        message = error.message;
    }
    else if (error instanceof typeorm_1.QueryFailedError) {
        statusCode = 400;
        message = 'Database query failed';
        if (error.driverError?.code === 'ER_DUP_ENTRY') {
            statusCode = 409;
            message = 'Duplicate entry found';
        }
    }
    else if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation failed';
    }
    else if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid data format';
    }
    else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }
    else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }
    if (process.env.NODE_ENV === 'development') {
        details = {
            stack: error.stack,
            name: error.name,
        };
    }
    console.error('Error:', {
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
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res, next) => {
    const error = new CustomError(`Route ${req.originalUrl} not found`, 404);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=error.middleware.js.map