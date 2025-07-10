import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth.type";

export class JwtUtil {
  private static getAccessTokenSecret(): string {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new Error("JWT_ACCESS_SECRET is not defined");
    }
    return secret;
  }

  private static getRefreshTokenSecret(): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error("JWT_REFRESH_SECRET is not defined");
    }
    return secret;
  }

  public static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.getAccessTokenSecret(), {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    } as jwt.SignOptions);
  }

  public static generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.getRefreshTokenSecret(), {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    } as jwt.SignOptions);
  }

  public static verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.getAccessTokenSecret()) as JwtPayload;
    } catch (error) {
      throw new Error("Invalid access token");
    }
  }

  public static verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.getRefreshTokenSecret()) as JwtPayload;
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }
}
