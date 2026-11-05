import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ROLE_KEY = 'userRole';

export async function saveSession(
    accessToken: string,
    refreshToken: string,
    role: string
) {
    await Promise.all([
        SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
        SecureStore.setItemAsync(USER_ROLE_KEY, role),
    ]);
}

export async function getAccessToken() {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken() {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function getUserRole() {
    return SecureStore.getItemAsync(USER_ROLE_KEY);
}

export async function getSession() {
    const [accessToken, refreshToken, role] = await Promise.all([
        getAccessToken(),
        getRefreshToken(),
        getUserRole(),
    ]);
    return { accessToken, refreshToken, role };
}

export async function clearSession() {
    await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_ROLE_KEY),
    ]);
}