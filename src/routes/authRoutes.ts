import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth.middleware";
import { body } from "express-validator";
import { validationMiddleware } from "../middleware/validation.middleware";
import { authLimiter } from "../middleware/security.middleware";

const router = Router();
const authController = new AuthController();

const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    ),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

const refreshTokenValidation = [
  body("refresh_token").notEmpty().withMessage("Refresh token is required"),
];

router.post(
  "/register",
  authLimiter,
  registerValidation,
  validationMiddleware,
  authController.register,
);
router.post(
  "/login",
  authLimiter,
  loginValidation,
  validationMiddleware,
  authController.login,
);
router.post(
  "/refresh-token",
  refreshTokenValidation,
  validationMiddleware,
  authController.refreshToken,
);
router.get("/profile", authMiddleware, authController.profile);

export default router;
