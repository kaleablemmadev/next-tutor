// src/schemas/tutor-application.schema.ts

import { z } from 'zod';

export const updateTutorProfileSchema = z.object({
    fullName: z.string().trim().min(2).max(100),
    gender: z.enum(['MALE', 'FEMALE']),
    city: z.string().trim().min(1).max(100),
    subCity: z.string().trim().min(1).max(100),
    woreda: z.string().trim().min(1).max(100),
    village: z.string().trim().min(1).max(100),
    educationStatus: z.enum(['NONGRADUATE', 'GRADUATE']),
    subjectIds: z.array(z.string().uuid()).min(1),
    excludedSubjectIds: z.array(z.string().uuid()).default([]),
    teachableGradeIds: z.array(z.string().uuid()).min(1),
    preferredGradeIds: z.array(z.string().uuid()).default([]),
    additionalSkills: z.array(
        z.object({
            name: z.string().trim().min(1).max(100),
            description: z.string().trim().max(500).optional(),
        })
    ).default([]),
});