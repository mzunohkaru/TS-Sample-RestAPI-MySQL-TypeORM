import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import { authLimiter } from "../middleware/security.middleware";
import {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
} from "../validation/authValidation";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  authLimiter,
  registerValidation,
  validationMiddleware,
  authController.register
);
router.post(
  "/login",
  authLimiter,
  loginValidation,
  validationMiddleware,
  authController.login
);
router.post(
  "/refresh-token",
  refreshTokenValidation,
  validationMiddleware,
  authController.refreshToken
);
router.get("/profile", authMiddleware, authController.profile);

export default router;
