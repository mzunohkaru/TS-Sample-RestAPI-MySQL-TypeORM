"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUtil = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtUtil {
    static getAccessTokenSecret() {
        const secret = process.env.JWT_ACCESS_SECRET;
        if (!secret) {
            throw new Error('JWT_ACCESS_SECRET is not defined');
        }
        return secret;
    }
    static getRefreshTokenSecret() {
        const secret = process.env.JWT_REFRESH_SECRET;
        if (!secret) {
            throw new Error('JWT_REFRESH_SECRET is not defined');
        }
        return secret;
    }
    static generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.getAccessTokenSecret(), {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        });
    }
    static generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.getRefreshTokenSecret(), {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        });
    }
    static verifyAccessToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.getAccessTokenSecret());
        }
        catch (error) {
            throw new Error('Invalid access token');
        }
    }
    static verifyRefreshToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.getRefreshTokenSecret());
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
}
exports.JwtUtil = JwtUtil;
//# sourceMappingURL=jwt.util.js.map