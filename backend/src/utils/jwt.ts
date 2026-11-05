// src/utils/jwt.ts
import 'dotenv/config';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set.')
}

export interface AccessTokenPayload {
    sub: string;
    role: string;
}

export const signAccessToken = (
    user: AccessTokenPayload
): string => {
    return jwt.sign(
        { role: user.role },
        jwtSecret,
        {
            subject: user.sub,
            expiresIn: '15m',
            algorithm: 'HS256'
        }
    )
}