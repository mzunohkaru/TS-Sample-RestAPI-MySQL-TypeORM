"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const validationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(error => ({
            field: error.type === 'field' ? error.path : 'unknown',
            message: error.msg,
            value: error.type === 'field' ? error.value : undefined,
        }));
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: formattedErrors,
        });
        return;
    }
    next();
};
exports.validationMiddleware = validationMiddleware;
//# sourceMappingURL=validation.middleware.js.map