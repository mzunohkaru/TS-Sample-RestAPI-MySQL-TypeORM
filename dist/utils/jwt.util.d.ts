import { JwtPayload } from '../interfaces/auth.interface';
export declare class JwtUtil {
    private static getAccessTokenSecret;
    private static getRefreshTokenSecret;
    static generateAccessToken(payload: JwtPayload): string;
    static generateRefreshToken(payload: JwtPayload): string;
    static verifyAccessToken(token: string): JwtPayload;
    static verifyRefreshToken(token: string): JwtPayload;
}
//# sourceMappingURL=jwt.util.d.ts.map