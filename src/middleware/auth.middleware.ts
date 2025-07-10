import { Request, Response, NextFunction } from "express";
import { JwtUtil } from "../utils/jwt.util";
import { JwtPayload } from "../types/auth.type";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Access token is required",
      });
      return;
    }

    const token = authHeader.substring(7);

    try {
      const payload = JwtUtil.verifyAccessToken(token);
      req.user = payload;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired access token",
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
};

export const optionalAuthMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      next();
      return;
    }

    const token = authHeader.substring(7);

    try {
      const payload = JwtUtil.verifyAccessToken(token);
      req.user = payload;
      next();
    } catch (error) {
      next();
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
};
