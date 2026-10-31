
import { API_BASE_URL } from '@/config/api';

export type RegisterTutorInput = {
    userName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    gender: 'MALE' | 'FEMALE';
    educationStatus: 'NONGRADUATE' | 'GRADUATE';
};

type RegisterTutorResponse = {
    message: string;
    data: {
        id: string;
        fullName: string;
        username: string;
        email: string;
        phoneNumber: string;
        role: string;
        emailVerified: boolean;
        gender: 'MALE' | 'FEMALE';
    };
};

export async function registerTutor(
    input: RegisterTutorInput
): Promise<RegisterTutorResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message ?? 'Unable to create your account.');
    }

    return result as RegisterTutorResponse;
}
