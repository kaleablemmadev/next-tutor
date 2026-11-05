// src/services/tutor-application.service.ts
import { prisma } from '../prisma.js';
import { updateTutorProfileSchema } from '../schemas/tutor-application.schema.js';

type TutorApplicationErrorCode =
    | 'VALIDATION_ERROR'
    | 'APPLICATION_NOT_FOUND'
    | 'APPLICATION_LOCKED';

export class TutorApplicationError extends Error {
    constructor(
        public readonly code: TutorApplicationErrorCode,
        message: string,
        public readonly details?: unknown,
    ) {
        super(message);
        this.name = 'TutorApplicationError';
    }
}

export const getTutorApplication = async (userId: string) => {
    const application = await prisma.tutorApplication.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: {
                    fullName: true,
                    gender: true,
                    city: true,
                    subCity: true,
                    woreda: true,
                    village: true,
                },
            },
            teachableSubjects: {
                include: { subject: true },
            },
            excludedSubjects: {
                include: { subject: true },
            },
            teachableGrades: {
                include: { grade: true },
            },
            preferredGrades: {
                include: { grade: true },
            },
            additionalSkills: true,
            documents: true,
            invitationVerifications: true,
        },
    });

    if (!application) {
        throw new TutorApplicationError(
            'APPLICATION_NOT_FOUND',
            'Tutor application not found.',
        );
    }

    return application;
};

export const updateTutorProfile = async (
    userId: string,
    profileData: unknown,
) => {
    const result = updateTutorProfileSchema.safeParse(profileData);

    if (!result.success) {
        throw new TutorApplicationError(
            'VALIDATION_ERROR',
            'Invalid tutor profile data.',
            result.error.issues,
        );
    }

    const input = result.data;

    const application = await prisma.tutorApplication.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    if (!application) {
        throw new TutorApplicationError(
            'APPLICATION_NOT_FOUND',
            'Tutor application not found.',
        );
    }

    if (!['DRAFT', 'REJECTED'].includes(application.status)) {
        throw new TutorApplicationError(
            'APPLICATION_LOCKED',
            'This application cannot currently be edited.',
        );
    }

    return prisma.$transaction(async (tx) => {
        await tx.user.update({
            where: { id: userId },
            data: {
                fullName: input.fullName,
                gender: input.gender,
                city: input.city,
                subCity: input.subCity,
                woreda: input.woreda,
                village: input.village,
            },
        });

        await tx.tutorApplication.update({
            where: { id: application.id },
            data: {
                educationStatus: input.educationStatus,
            },
        });

        // Replace existing subject selections.
        await tx.tutorApplicationSubject.deleteMany({
            where: { applicationId: application.id },
        });

        await tx.tutorApplicationSubject.createMany({
            data: input.subjectIds.map((subjectId) => ({
                applicationId: application.id,
                subjectId,
            })),
        });

        await tx.tutorApplicationExcludedSubject.deleteMany({
            where: { applicationId: application.id },
        });

        if (input.excludedSubjectIds.length > 0) {
            await tx.tutorApplicationExcludedSubject.createMany({
                data: input.excludedSubjectIds.map((subjectId) => ({
                    applicationId: application.id,
                    subjectId,
                })),
            });
        }

        // Replace existing grade selections.
        await tx.tutorApplicationGrade.deleteMany({
            where: { applicationId: application.id },
        });

        await tx.tutorApplicationGrade.createMany({
            data: input.teachableGradeIds.map((gradeId) => ({
                applicationId: application.id,
                gradeId,
            })),
        });

        await tx.tutorApplicationPreferredGrade.deleteMany({
            where: { applicationId: application.id },
        });

        if (input.preferredGradeIds.length > 0) {
            await tx.tutorApplicationPreferredGrade.createMany({
                data: input.preferredGradeIds.map((gradeId) => ({
                    applicationId: application.id,
                    gradeId,
                })),
            });
        }

        // Replace additional skills.
        await tx.applicationSkill.deleteMany({
            where: { applicationId: application.id },
        });

        if (input.additionalSkills.length > 0) {
            await tx.applicationSkill.createMany({
                data: input.additionalSkills.map((skill) => ({
                    applicationId: application.id,
                    name: skill.name,
                    description: skill.description ?? null,
                })),
            });
        }

        return tx.tutorApplication.findUniqueOrThrow({
            where: { id: application.id },
            include: {
                user: {
                    select: {
                        fullName: true,
                        gender: true,
                        city: true,
                        subCity: true,
                        woreda: true,
                        village: true,
                    },
                },
                teachableSubjects: { include: { subject: true } },
                excludedSubjects: { include: { subject: true } },
                teachableGrades: { include: { grade: true } },
                preferredGrades: { include: { grade: true } },
                additionalSkills: true,
            },
        });
    });
};