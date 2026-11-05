// src/services/refresh-token.service.ts
import { prisma } from '../prisma.js';
import {
    generateRefreshToken, hashRefreshToken, getRefreshTokenExpiry
} from '../utils/refresh-token.js';
import { signAccessToken } from '../utils/jwt.js';
import { RegistrationError } from './auth.service.js';

export async function createRefreshToken(userId: string) {
    const token = generateRefreshToken();
    const tokenHash = hashRefreshToken(token);
    const expiresAt = getRefreshTokenExpiry();

    await prisma.refreshToken.create({
        data: {
            userId,
            tokenHash,
            expiresAt,
        },
    });

    return token;
}

export async function findRefreshToken(token: string) {
    const tokenHash = hashRefreshToken(token);

    return prisma.refreshToken.findUnique({
        where: {
            tokenHash,
        },
    });
}

export async function validateRefreshToken(token: string) {
    const record = await findRefreshToken(token);

    if (!record) {
        return null;
    }

    if (record.revokedAt !== null) {
        return null;
    }

    if (record.expiresAt <= new Date()) {
        return null;
    }

    return record;
}

export async function refreshAccessToken(token: string) {
    const record = await validateRefreshToken(token);

    if (!record) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: record.userId,
        },
        select: {
            id: true,
            role: true,
        },
    });

    if (!user) {
        return null;
    }

    const newRefreshToken = generateRefreshToken();
    const newTokenHash = hashRefreshToken(newRefreshToken);
    const newExpiresAt = getRefreshTokenExpiry();

    const rotated = await prisma.$transaction(async (tx) => {
        const result = await tx.refreshToken.updateMany({
            where: {
                id: record.id,
                revokedAt: null,
                expiresAt: {
                    gt: new Date(),
                },
            },
            data: {
                revokedAt: new Date(),
            },
        });

        if (result.count !== 1) {
            return false;
        }

        await tx.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: newTokenHash,
                expiresAt: newExpiresAt,
            },
        });

        return true;
    });

    if (!rotated) {
        return null;
    }

    const accessToken = signAccessToken({
        sub: user.id,
        role: user.role,
    });

    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
}

export async function revokeRefreshToken(token: string) {
    const tokenHash = hashRefreshToken(token);

    const refreshToken = await prisma.refreshToken.findUnique({
        where: { tokenHash },
    });

    if (!refreshToken) {
        return {
            success: false,
            message: 'Refresh token not found.',
        };
    }

    if (refreshToken.revokedAt !== null) {
        return {
            success: false,
            message: 'Refresh token already revoked.',
        };
    }

    const result = await prisma.refreshToken.updateMany({
        where: {
            id: refreshToken.id,
            revokedAt: null,
            expiresAt: { gt: new Date() },
        },
        data: {
            revokedAt: new Date(),
        },
    });

    if (result.count === 0) {
        return {
            success: false,
            message: 'Refresh token is expired or already revoked.',
        };
    }

    return {
        success: true,
        message: 'Refresh token revoked successfully.',
    };
}