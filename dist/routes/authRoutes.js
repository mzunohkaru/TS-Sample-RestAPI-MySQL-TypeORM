"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const express_validator_1 = require("express-validator");
const validation_middleware_1 = require("../middleware/validation.middleware");
const security_middleware_1 = require("../middleware/security.middleware");
const router = (0, express_1.Router)();
const authController = new authController_1.AuthController();
const registerValidation = [
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
];
const loginValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
];
const refreshTokenValidation = [
    (0, express_validator_1.body)('refresh_token')
        .notEmpty()
        .withMessage('Refresh token is required'),
];
router.post('/register', security_middleware_1.authLimiter, registerValidation, validation_middleware_1.validationMiddleware, authController.register);
router.post('/login', security_middleware_1.authLimiter, loginValidation, validation_middleware_1.validationMiddleware, authController.login);
router.post('/refresh-token', refreshTokenValidation, validation_middleware_1.validationMiddleware, authController.refreshToken);
router.get('/profile', auth_middleware_1.authMiddleware, authController.profile);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map