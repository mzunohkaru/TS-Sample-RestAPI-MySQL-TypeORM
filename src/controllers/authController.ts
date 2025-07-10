import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export class AuthController {
  private authService = new AuthService();

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      const result = await this.authService.register({ name, email, password });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
      });
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const result = await this.authService.login({ email, password });

      res.json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      });
    }
  };

  public refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        res.status(400).json({
          success: false,
          message: "Refresh token is required",
        });
        return;
      }

      const result = await this.authService.refreshToken(refresh_token);

      res.json({
        success: true,
        message: "Token refreshed successfully",
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Token refresh failed",
      });
    }
  };

  public profile = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const userProfile = await this.authService.getUserProfile(
        req.user.userId,
      );

      res.json({
        success: true,
        message: "Profile retrieved successfully",
        data: userProfile,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to retrieve profile",
      });
    }
  };
}
