"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_util_1 = require("../utils/jwt.util");
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Access token is required',
            });
            return;
        }
        const token = authHeader.substring(7);
        try {
            const payload = jwt_util_1.JwtUtil.verifyAccessToken(token);
            req.user = payload;
            next();
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired access token',
            });
            return;
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        return;
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map