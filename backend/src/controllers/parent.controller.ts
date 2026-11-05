import type {Request, Response} from 'express';
import { registerParentWithStudents } from '../services/parent.service.js';
import { RegistrationError } from '../services/auth.service.js';

export const registerParent = async (req: Request, res: Response) => {
    try {
        const result = await registerParentWithStudents(req.body);

        return res.status(201).json({
            message: 'Parent registered successfully',
            data: result,
        });
    } catch (error) {
        if (error instanceof RegistrationError) {
            const status = error.code === 'VALIDATION_ERROR' ? 400 : 409;

            return res.status(status).json({
                code: error.code,
                message: error.message,
                ...(error.details !== undefined && {
                    details: error.details,
                }),
            })
        }

        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: 'An unexpected error occured.'
        });
    }
}