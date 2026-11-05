import { useState } from 'react';
import { useRouter } from 'expo-router';
import { login } from '@/features/auth/api/login';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';

export default function ParentLoginScreen() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!identifier.trim() || !password.trim()) {
            setErrorMessage('Please enter your phone number, username, or email and password.');
            return;
        }

        setErrorMessage(null);
        setLoading(true);

        try {
            const response = await login({
                identifier: identifier.trim(),
                password,
            });

            const userRole = response.data.user.role;

            // Dynamic routing based on server-verified role
            if (userRole === 'PARENT') {
                router.replace('/parent/dashboard' as any);
            } else if (userRole === 'TUTOR') {
                router.replace('/tutor/home' as any);
            } else {
                router.replace('/' as any);
            }
        } catch (error: any) {
            setErrorMessage(error.message || 'Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.brandRow}>
                        <View style={styles.logo}>
                            <Text style={styles.logoLetter}>N</Text>
                        </View>
                        <Text style={styles.brandName}>Next Tutor</Text>
                    </View>

                    <View style={styles.intro}>
                        <Text style={styles.eyebrow}>PARENT PORTAL</Text>
                        <Text style={styles.title}>Welcome back</Text>
                        <Text style={styles.subtitle}>
                            Sign in to manage your children&apos;s tutoring offers and applications.
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Sign in to your account</Text>
                        <Text style={styles.cardSubtitle}>
                            Enter your login credentials below.
                        </Text>

                        <Text style={styles.label}>Phone Number, Username, or Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0911223344 or username"
                            placeholderTextColor="#999"
                            value={identifier}
                            onChangeText={(text) => {
                                setIdentifier(text);
                                if (errorMessage) setErrorMessage(null);
                            }}
                            autoCapitalize="none"
                        />

                        <View style={styles.passwordHeading}>
                            <Text style={styles.label}>Password</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (errorMessage) setErrorMessage(null);
                            }}
                        />

                        {errorMessage && (
                            <Text style={styles.error}>{errorMessage}</Text>
                        )}

                        <Pressable
                            style={({ pressed }) => [
                                styles.loginButton,
                                pressed && styles.pressed,
                                loading && styles.disabled,
                            ]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={colors.surface} />
                            ) : (
                                <Text style={styles.loginButtonText}>Sign in</Text>
                            )}
                        </Pressable>

                        <View style={styles.signupRow}>
                            <Text style={styles.signupText}>New to Next Tutor? </Text>
                            <Pressable onPress={() => router.push('/auth/parent-register' as any)}>
                                <Text style={styles.textAction}>Create account</Text>
                            </Pressable>
                        </View>
                    </View>

                    <Text style={styles.footer}>
                        Your next step starts here.
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    flex: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 24,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 44,
    },
    logo: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoLetter: {
        color: colors.surface,
        fontSize: 19,
        fontWeight: '800',
    },
    brandName: {
        color: colors.primary,
        fontSize: 23,
        fontWeight: '800',
        letterSpacing: -0.6,
    },
    intro: {
        marginBottom: 28,
    },
    eyebrow: {
        color: colors.primary,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.8,
        marginBottom: 12,
    },
    title: {
        color: colors.heading,
        fontSize: 34,
        lineHeight: 41,
        fontWeight: '800',
        letterSpacing: -1,
    },
    subtitle: {
        color: colors.text,
        fontSize: 15,
        lineHeight: 23,
        marginTop: 10,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 28,
        padding: 22,
        borderWidth: 1,
        borderColor: '#FFF0E8',
    },
    cardTitle: {
        color: colors.heading,
        fontSize: 21,
        fontWeight: '800',
    },
    cardSubtitle: {
        color: colors.muted,
        fontSize: 14,
        marginTop: 7,
        marginBottom: 27,
    },
    label: {
        color: colors.heading,
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 9,
    },
    input: {
        minHeight: 54,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 15,
        backgroundColor: '#FFFCFA',
        paddingHorizontal: 15,
        color: colors.heading,
        fontSize: 15,
        marginBottom: 22,
    },
    passwordHeading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textAction: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: '700',
    },
    error: {
        color: colors.error,
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 15,
    },
    loginButton: {
        minHeight: 56,
        borderRadius: 17,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    loginButtonText: {
        color: colors.surface,
        fontSize: 16,
        fontWeight: '800',
    },
    pressed: {
        opacity: 0.85,
    },
    disabled: {
        opacity: 0.65,
    },
    signupRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    signupText: {
        color: colors.text,
        fontSize: 13,
    },
    footer: {
        color: colors.muted,
        fontSize: 12,
        textAlign: 'center',
        marginTop: 24,
    },
});