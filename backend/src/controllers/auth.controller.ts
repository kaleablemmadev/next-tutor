// src/controllers/auth.controller.ts
import type { Request, Response } from 'express';
import {
    registerTutor,
    loginTutor,
    RegistrationError,
} from '../services/auth.service.js';
import { refreshAccessToken, revokeRefreshToken } from '../services/refresh-token.service.js';

export const register = async (req: Request, res: Response) => {
    try {
        const result = await registerTutor(req.body);

        return res.status(201).json({
            message: 'Registration successful.',
            data: result,
        });
    } catch (error) {
        if (error instanceof RegistrationError) {
            const status = error.code === 'VALIDATION_ERROR'
                ? 400
                : 409;

            return res.status(status).json({
                code: error.code,
                message: error.message,
                ...(error.details !== undefined && {
                    details: error.details,
                }),
            });
        }

        console.error('Unexpected registration error:', error);

        return res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred.',
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const result = await loginTutor(req.body);

        return res.status(200).json({
            message: 'Login successful',
            data: result
        });
    } catch (error) {
        if (error) {
            if (error instanceof RegistrationError) {
                const status = error.code === 'VALIDATION_ERROR' ? 400 : error.code === 'AUTHENTICATION_FAILED' ? 401 : error.code === 'ACCOUNT_CONFLICT' ? 409 : 500;

                return res.status(status).json({
                    code: error.code,
                    message: error.message,
                    ...(error.details !== undefined && {
                        details: error.details,
                    }),
                });
            }
        }

        console.error('Unexpected login error:', error);

        return res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred.',
        });
    }
}

export async function refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (typeof refreshToken !== 'string' || !refreshToken) {
        return res.status(400).json({
            code: 'VALIDATION_ERROR',
            message: 'Refresh token is required.',
        });
    }

    try {
        const result = await refreshAccessToken(refreshToken);

        if (!result) {
            return res.status(401).json({
                code: 'INVALID_REFRESH_TOKEN',
                message: 'Refresh token is invalid or expired.',
            });
        }

        return res.status(200).json({
            message: 'Access token refreshed successfully.',
            data: result,
        });
    } catch {
        return res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred.',
        });
    }
}

export async function logout(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (typeof refreshToken !== 'string' || !refreshToken.trim()) {
        return res.status(400).json({
            code: 'VALIDATION_ERROR',
            message: 'Refresh token is required.',
        });
    }

    const result = await revokeRefreshToken(refreshToken);

    if (!result.success) {
        return res.status(401).json({
            code: 'INVALID_REFRESH_TOKEN',
            message: result.message,
        });
    }

    return res.status(200).json({
        message: 'Logout successful.',
    });
}