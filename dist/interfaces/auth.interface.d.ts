export interface AuthRequest {
    email: string;
    password: string;
}
export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}
export interface JwtPayload {
    userId: number;
    email: string;
    iat?: number;
    exp?: number;
}
//# sourceMappingURL=auth.interface.d.ts.map