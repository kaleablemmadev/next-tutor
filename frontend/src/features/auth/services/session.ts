import * as SecureStore from 'expo-secure-store';
import {Platform} from 'react-native';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ROLE_KEY = 'userRole';

export async function saveSession(
    accessToken: string,
    refreshToken: string,
    role: string
) {
    if (Platform.OS === 'web') {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem(USER_ROLE_KEY, role);
        return; // <-- Add this return statement!
    }

    await Promise.all([
        SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
        SecureStore.setItemAsync(USER_ROLE_KEY, role),
    ]);
}

export async function getAccessToken() {
    if(Platform.OS === 'web') {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    }

    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken() {
    if (Platform.OS === 'web') {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }

    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function getUserRole() {
    if (Platform.OS === 'web') {
        return localStorage.getItem(USER_ROLE_KEY);
    }

    return SecureStore.getItemAsync(USER_ROLE_KEY);
}

export async function getSession() {
    if (Platform.OS === 'web') {
        return {
            accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
            refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
            role: localStorage.getItem(USER_ROLE_KEY),
        };
    }

    const [accessToken, refreshToken, role] = await Promise.all([
        getAccessToken(),
        getRefreshToken(),
        getUserRole(),
    ]);
    return { accessToken, refreshToken, role };
}

export async function clearSession() {
    if (Platform.OS === 'web') {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_ROLE_KEY);
        return;
    }

    await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_ROLE_KEY),
    ]);
}