import type { Request, Response } from 'express';
import {
    getTutorApplication,
    updateTutorProfile,
    TutorApplicationError,
} from '../services/tutor-application.service.js';

export const getApplication = async (
    _req: Request,
    res: Response,
) => {
    try {
        const userId = res.locals.auth.sub;

        const application = await getTutorApplication(userId);

        return res.status(200).json({
            message: 'Tutor application retrieved successfully.',
            data: application,
        });
    } catch (error) {
        if (error instanceof TutorApplicationError) {
            const status = error.code === 'APPLICATION_NOT_FOUND'
                ? 404
                : 400;

            return res.status(status).json({
                code: error.code,
                message: error.message,
                ...(error.details !== undefined && {
                    details: error.details,
                }),
            });
        };

        console.error('Unexpected error while retrieving tutor application:', error);

        return res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred.',
        });
    }
};

export const updateProfile = async(
    req: Request,
    res: Response,
) => {
    try {
        const userId = res.locals.auth.sub;

        const application = await updateTutorProfile(userId, req.body);

        return res.status(200).json({
            message: 'Tutor profile updated successfully.',
            data: application,
        });
    } catch (error) {
        if (error instanceof TutorApplicationError) {
            const status = error.code === 'APPLICATION_NOT_FOUND' ? 404 : error.code === "APPLICATION_LOCKED" ? 409 : 400;
            return res.status(status).json({
                code: error.code,
                message: error.message,
                ...(error.details !== undefined && {
                    details: error.details,
                }),
            });
        }

        console.error('Unexpected error while updating tutor profile:', error);

        return res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred.',
        });
    }
}