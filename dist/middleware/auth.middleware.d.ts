import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../interfaces/auth.interface';
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}
export declare const authMiddleware: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map