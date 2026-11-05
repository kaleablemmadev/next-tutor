// src/services/parent.service.ts
import { hashPassword } from '../utils/security.js';
import { registerParentSchema } from '../schemas/parent.schema.js';
import { prisma } from '../prisma.js';
import { Prisma } from '../generated/prisma/client.js';
import { Role } from '../constants/constantEnums.js';
import { RegistrationError } from './auth.service.js';

export const registerParentWithStudents = async (parentData: unknown) => {
    const result = registerParentSchema.safeParse(parentData);

    if (!result.success) {
        throw new RegistrationError(
            'VALIDATION_ERROR',
            'Invalid parent registration data',
            result.error.issues
        );
    }

    const input = result.data;

    try {
        const hashedPassword = await hashPassword(input.password);

        const resultTransaction = await prisma.$transaction(async (tx) => {
            const parent = await tx.user.create({
                data: {
                    username: input.username,
                    phoneNumber: input.phoneNumber,
                    email: input.email?.trim() ?? null,
                    passwordHash: hashedPassword,
                    role: Role.PARENT,
                    fullName: input.fullName,
                    emailVerified: false,
                    city: input.city,
                    subCity: input.subCity,
                    woreda: input.woreda ?? null,
                    village: input.village ?? null,
                },
                select: {
                    id: true,
                    username: true,
                    phoneNumber: true,
                    email: true,
                    fullName: true,
                    city: true,
                    subCity: true,
                    role: true,
                },
            });

            const createdStudents = [];
            for (const studentData of input.students) {
                const { weakSubjects, preferredGender, preferredMinAge, preferredMaxAge, additionalNotes, ...studentFields } = studentData;

                const newStudent = await tx.student.create({
                    data: {
                        ...studentFields,
                        parentId: parent.id,
                        preferredGender: studentData.preferredGender ?? null,
                        preferredMinAge: studentData.preferredMinAge ?? null,
                        preferredMaxAge: studentData.preferredMaxAge ?? null,
                        additionalNotes: studentData.additionalNotes ?? null,
                        ...(weakSubjects && weakSubjects.length > 0
                            ? {
                                weakSubjects: {
                                    create: weakSubjects.map((ws) => ({
                                        subjectId: ws.subjectId,
                                        gradeId: ws.gradeId,
                                    })),
                                },
                            } : {}),
                    },
                    include: {
                        weakSubjects: {
                            include: {
                                subject: true,
                                grade: true,
                            }
                        },
                        grade: true,
                    },
                });

                createdStudents.push(newStudent);
            }

            return { parent, students: createdStudents };
        });

        return resultTransaction;
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            const target = error.meta?.target;
            const fields = Array.isArray(target)
                ? target.map(String)
                : typeof target === 'string'
                    ? target.split(',').map(field => field.trim())
                    : [];

            const messages: Record<string, string> = {
                username: 'This username is already taken.',
                email: 'This email address is already registered.',
                phoneNumber: 'This phone number is already registered.',
            };

            const conflictingField = fields.find(field => field in messages);

            throw new RegistrationError(
                'ACCOUNT_CONFLICT',
                conflictingField
                    ? messages[conflictingField] ?? 'An account already exists with one of these details.'
                    : 'An account already exists with one of these details.'
            );
        }

        throw error;
    }
};