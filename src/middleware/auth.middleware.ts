import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';
import { verifyAccessToken } from '../utils/jwt.utils';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Unauthorized - No token provided'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token) as any;
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    next(new ApiError(401, 'Unauthorized - Invalid or expired token'));
  }
};