import { User } from '../entity/User';
import { AuthRequest, AuthResponse } from '../interfaces/auth.interface';
export declare class AuthService {
    private userRepository;
    register(userData: AuthRequest & {
        name: string;
    }): Promise<AuthResponse>;
    login(credentials: AuthRequest): Promise<AuthResponse>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
    getUserProfile(userId: number): Promise<Omit<User, 'password'>>;
}
//# sourceMappingURL=authService.d.ts.map