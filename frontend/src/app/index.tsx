import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getSession } from '@/features/auth/services/session';
import {
    ActivityIndicator,
    Pressable,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { colors } from '@/theme/colors';

export default function EntryScreen() {
    const router = useRouter();
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    const checkSession = useCallback(async () => {
        try {
            const { accessToken, role } = await getSession();

            if (accessToken && role) {
                if (role === 'PARENT') {
                    router.replace('/parent/dashboard' as any);
                    return;
                }
                if (role === 'TUTOR') {
                    router.replace('/tutor/home');
                    return;
                }
            }
        } catch (error) {
            console.error('Failed to restore auth session:', error);
        } finally {
            setIsCheckingSession(false);
        }
    }, [router]);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    if (isCheckingSession) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <StatusBar barStyle="dark-content" />
                <ActivityIndicator size="large" color={colors.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.content}>
                <View style={styles.brandContainer}>
                    <View style={styles.logo}>
                        <Text style={styles.logoLetter}>N</Text>
                    </View>
                    <Text style={styles.brandName}>Next Tutor</Text>
                    <Text style={styles.tagline}>
                        Hyper-local Ethiopian tutoring marketplace.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardEyebrow}>WELCOME</Text>
                    <Text style={styles.cardTitle}>Choose your account type</Text>
                    <Text style={styles.cardSubtitle}>
                        Select how you want to use Next Tutor to get started.
                    </Text>

                    <View style={styles.buttonGroup}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.primaryButton,
                                pressed && styles.pressed,
                            ]}
                            onPress={() => router.push('/auth/parent-login' as any)}
                        >
                            <Text style={styles.primaryButtonText}>
                                I am a Parent / Guardian
                            </Text>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.secondaryButton,
                                pressed && styles.pressed,
                            ]}
                            onPress={() => router.push('/auth/tutor-login' as any)}
                        >
                            <Text style={styles.secondaryButtonText}>
                                I am a Tutor
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <Text style={styles.footer}>
                    Your next step starts here.
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 24,
        justifyContent: 'space-between',
    },
    brandContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    logo: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    logoLetter: {
        color: colors.surface,
        fontSize: 28,
        fontWeight: '800',
    },
    brandName: {
        color: colors.primary,
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -1,
    },
    tagline: {
        color: colors.text,
        fontSize: 15,
        marginTop: 8,
        textAlign: 'center',
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 28,
        padding: 24,
        borderWidth: 1,
        borderColor: '#FFF0E8',
    },
    cardEyebrow: {
        color: colors.primary,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.8,
        marginBottom: 8,
    },
    cardTitle: {
        color: colors.heading,
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    cardSubtitle: {
        color: colors.muted,
        fontSize: 14,
        lineHeight: 20,
        marginTop: 6,
        marginBottom: 24,
    },
    buttonGroup: {
        gap: 12,
    },
    primaryButton: {
        minHeight: 56,
        borderRadius: 17,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        color: colors.surface,
        fontSize: 16,
        fontWeight: '800',
    },
    secondaryButton: {
        minHeight: 56,
        borderRadius: 17,
        borderWidth: 1.5,
        borderColor: colors.primary,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '800',
    },
    pressed: {
        opacity: 0.85,
    },
    footer: {
        color: colors.muted,
        fontSize: 12,
        textAlign: 'center',
    },
});