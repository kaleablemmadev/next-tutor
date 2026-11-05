// src/features/auth/api/logout.ts
import { API_BASE_URL } from '@/config/api';
import {
    clearSession,
    getRefreshToken,
} from '../services/session';

export async function logout(): Promise<boolean> {
    let serverLogoutSucceeded = false;

    try {
        const refreshToken = await getRefreshToken();

        if (refreshToken) {
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            serverLogoutSucceeded = response.ok;
        }
    } catch (error) {
        console.error('Backend logout failed:', error);
    } finally {
        await clearSession();
    }

    return serverLogoutSucceeded;
}