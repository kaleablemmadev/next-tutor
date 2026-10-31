import { API_BASE_URL } from "@/config/api";

type LoginInput = {
    identifier: string;
    password: string;
}

type LoginResponse = {
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            username: string;
            email?: string;
            phoneNumber?: string;
            role: string;
        };
    };
};

export async function login(input: LoginInput): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message ?? 'Unable to sign in.');
    }

    return result as LoginResponse;
}