// src/schemas/parent.schema.ts
import { z } from 'zod';
import { phoneSchema } from './auth.schema.js';

export const registerParentSchema = z.object({
    username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
    fullName: z.string().min(3, { message: 'Full name must be at least 3 characters long' }),
    phoneNumber: phoneSchema,
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
    city: z.string().min(1, { message: 'City is required' }),
    subCity: z.string().min(1, { message: 'Sub-city is required' }),
    woreda: z.string().optional(),
    village: z.string().optional(), // Sefer name
    students: z.array(
        z.object({
            fullName: z.string().min(2, { message: 'Student full name must be at least 2 characters long' }),
            gradeId: z.string().uuid({ message: 'Invalid grade ID format' }),
            preferredGender: z.enum(['MALE', 'FEMALE']).optional(),
            preferredMinAge: z.number().int().positive().optional(),
            preferredMaxAge: z.number().int().positive().optional(),
            requireCertification: z.boolean().default(false),
            additionalNotes: z.string().optional(),
            weakSubjects: z.array(
                z.object({
                    subjectId: z.string().uuid({ message: 'Invalid subject ID format' }),
                    gradeId: z.string().uuid({ message: 'Invalid grade ID format' }),
                })
            ).optional(),
        })
    ).min(1, { message: 'At least one student profile is required' }),
});

export type RegisterParentInput = z.infer<typeof registerParentSchema>;