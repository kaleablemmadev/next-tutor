// src/utils/storage.ts
import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'nexttutor_access_token';
const REFRESH_TOKEN_KEY = 'nexttutor_refresh_token';
const USER_ROLE_KEY = 'nexttutor_user_role';

export async function saveTokens(accessToken: string, refreshToken: string, role: string) {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    await SecureStore.setItemAsync(USER_ROLE_KEY, role);
}

export async function getSession() {
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    const role = await SecureStore.getItemAsync(USER_ROLE_KEY);
    return { accessToken, refreshToken, role };
}

export async function clearSession() {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_ROLE_KEY);
}