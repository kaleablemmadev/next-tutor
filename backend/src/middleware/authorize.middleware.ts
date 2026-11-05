// src/middleware/authorize.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import type { Role } from '../generated/prisma/client.js';

export const authorizeRoles = (...allowedRoles: Role[]) => {
    return (
        _req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const auth = res.locals.auth;

        if (!auth || typeof auth.role !== 'string') {
            return res.status(401).json({
                code: 'UNAUTHORIZED',
                message: 'Authentication is required.',
            });
        }

        if (!allowedRoles.includes(auth.role as Role)) {
            return res.status(403).json({
                code: 'FORBIDDEN',
                message: 'You do not have permission to access this resource.',
            });
        }

        return next();
    };
};