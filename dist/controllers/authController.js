"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
class AuthController {
    constructor() {
        this.authService = new authService_1.AuthService();
        this.register = async (req, res) => {
            try {
                const { name, email, password } = req.body;
                const result = await this.authService.register({ name, email, password });
                res.status(201).json({
                    success: true,
                    message: 'User registered successfully',
                    data: result,
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Registration failed',
                });
            }
        };
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                const result = await this.authService.login({ email, password });
                res.json({
                    success: true,
                    message: 'Login successful',
                    data: result,
                });
            }
            catch (error) {
                res.status(401).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Login failed',
                });
            }
        };
        this.refreshToken = async (req, res) => {
            try {
                const { refresh_token } = req.body;
                if (!refresh_token) {
                    res.status(400).json({
                        success: false,
                        message: 'Refresh token is required',
                    });
                    return;
                }
                const result = await this.authService.refreshToken(refresh_token);
                res.json({
                    success: true,
                    message: 'Token refreshed successfully',
                    data: result,
                });
            }
            catch (error) {
                res.status(401).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Token refresh failed',
                });
            }
        };
        this.profile = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({
                        success: false,
                        message: 'User not authenticated',
                    });
                    return;
                }
                const userProfile = await this.authService.getUserProfile(req.user.userId);
                res.json({
                    success: true,
                    message: 'Profile retrieved successfully',
                    data: userProfile,
                });
            }
            catch (error) {
                res.status(404).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Failed to retrieve profile',
                });
            }
        };
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map