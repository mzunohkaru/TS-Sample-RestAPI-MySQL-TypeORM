import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { AuthRequest, AuthResponse } from "../types/auth.type";
import { PasswordUtil } from "../utils/password.util";
import { JwtUtil } from "../utils/jwt.util";

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  public async register(
    userData: AuthRequest & { name: string },
  ): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await PasswordUtil.hashPassword(userData.password);

    const user = this.userRepository.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    const payload = {
      userId: savedUser.id,
      email: savedUser.email,
    };

    const accessToken = JwtUtil.generateAccessToken(payload);
    const refreshToken = JwtUtil.generateRefreshToken(payload);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
      },
    };
  }

  public async login(credentials: AuthRequest): Promise<AuthResponse> {
    const user = await this.userRepository.findOne({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await PasswordUtil.comparePassword(
      credentials.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const payload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = JwtUtil.generateAccessToken(payload);
    const refreshToken = JwtUtil.generateRefreshToken(payload);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  public async refreshToken(
    refreshToken: string,
  ): Promise<{ access_token: string }> {
    try {
      const payload = JwtUtil.verifyRefreshToken(refreshToken);

      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const newPayload = {
        userId: user.id,
        email: user.email,
      };

      const newAccessToken = JwtUtil.generateAccessToken(newPayload);

      return {
        access_token: newAccessToken,
      };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  public async getUserProfile(userId: number): Promise<Omit<User, "password">> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const { password, ...userProfile } = user;
    return userProfile;
  }
}
