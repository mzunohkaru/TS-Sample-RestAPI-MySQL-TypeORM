"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const password_util_1 = require("../utils/password.util");
const jwt_util_1 = require("../utils/jwt.util");
class AuthService {
    constructor() {
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    }
    async register(userData) {
        const existingUser = await this.userRepository.findOne({
            where: { email: userData.email },
        });
        if (existingUser) {
            throw new Error('User already exists');
        }
        const hashedPassword = await password_util_1.PasswordUtil.hashPassword(userData.password);
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
        const accessToken = jwt_util_1.JwtUtil.generateAccessToken(payload);
        const refreshToken = jwt_util_1.JwtUtil.generateRefreshToken(payload);
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
    async login(credentials) {
        const user = await this.userRepository.findOne({
            where: { email: credentials.email },
        });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isPasswordValid = await password_util_1.PasswordUtil.comparePassword(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        const payload = {
            userId: user.id,
            email: user.email,
        };
        const accessToken = jwt_util_1.JwtUtil.generateAccessToken(payload);
        const refreshToken = jwt_util_1.JwtUtil.generateRefreshToken(payload);
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
    async refreshToken(refreshToken) {
        try {
            const payload = jwt_util_1.JwtUtil.verifyRefreshToken(refreshToken);
            const user = await this.userRepository.findOne({
                where: { id: payload.userId },
            });
            if (!user) {
                throw new Error('User not found');
            }
            const newPayload = {
                userId: user.id,
                email: user.email,
            };
            const newAccessToken = jwt_util_1.JwtUtil.generateAccessToken(newPayload);
            return {
                access_token: newAccessToken,
            };
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
    async getUserProfile(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const { password, ...userProfile } = user;
        return userProfile;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map