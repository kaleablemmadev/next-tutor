// src/utils/refresh-token.ts

import { createHash, randomBytes } from 'node:crypto';

const REFRESH_TOKEN_BYTES = 32;
export const REFRESH_TOKEN_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

export function generateRefreshToken(): string {
    return randomBytes(REFRESH_TOKEN_BYTES).toString('hex');
}

export function hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
}

export function getRefreshTokenExpiry(): Date {
    return new Date(Date.now() + REFRESH_TOKEN_LIFETIME_MS);
}