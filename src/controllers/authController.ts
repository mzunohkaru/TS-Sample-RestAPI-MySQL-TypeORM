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

  public me = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const userMe = await this.authService.getUserMe(
        req.user.userId
      );

      res.json({
        success: true,
        message: "Profile retrieved successfully",
        data: userMe,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to retrieve profile",
      });
    }
  };

  public updateMe = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const { name, age } = req.body;

      // nameかageの少なくとも1つが必要
      if (!name && age === undefined) {
        res.status(400).json({
          success: false,
          message: "At least one field (name or age) is required",
        });
        return;
      }

      // 更新するデータを準備
      const updateData: { name?: string; age?: number } = {};
      if (name !== undefined) updateData.name = name;
      if (age !== undefined) updateData.age = age;

      const result = await this.authService.updateUserMe(
        req.user.userId,
        updateData
      );

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to update profile",
      });
    }
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refresh_token } = req.body;
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Logout failed",
      });
    }
  };
}
