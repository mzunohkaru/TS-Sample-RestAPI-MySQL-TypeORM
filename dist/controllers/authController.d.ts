import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
export declare class AuthController {
    private authService;
    register: (req: Request, res: Response) => Promise<void>;
    login: (req: Request, res: Response) => Promise<void>;
    refreshToken: (req: Request, res: Response) => Promise<void>;
    profile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
}
//# sourceMappingURL=authController.d.ts.map