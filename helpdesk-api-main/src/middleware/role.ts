import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../models/user';

export function requireRole(...roles: string[]) {   
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("req");
    
    const user = req.user as TokenPayload | undefined;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    if (!roles.includes(user.role as string)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}
