// src/app/auth/tutor-login.tsx
import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { login } from '@/features/auth/api/login';

export default function LoginScreen() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();

    async function handleLogin() {
        if (!identifier.trim() || !password) {
            setError('Enter your username, email, or phone number and password.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const result = await login({
                identifier: identifier.trim(),
                password,
            });

            if (result.data.user.role === 'TUTOR') {
                router.replace('/tutor/home');
                return;
            }

            console.log("Login successful for: ", result.data.user.username);
            setError('Login successful!');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="dark" />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.brandRow}>
                        <View style={styles.logo}>
                            <Text style={styles.logoLetter}>NT</Text>
                        </View>

                        <Text style={styles.brandName}>Next Tutor</Text>
                    </View>

                    <View style={styles.intro}>
                        <Text style={styles.eyebrow}>LEARN. GROW. SUCCEED.</Text>
                        <Text style={styles.title}>Welcome back!</Text>
                        <Text style={styles.subtitle}>
                            Find the right tutor or continue helping students reach their goals.
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Sign in to your account</Text>
                        <Text style={styles.cardSubtitle}>
                            Enter your details to continue.
                        </Text>

                        <Text style={styles.label}>Username, email or phone</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your identifier"
                            placeholderTextColor={colors.muted}
                            value={identifier}
                            onChangeText={setIdentifier}
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!loading}
                            returnKeyType="next"
                        />

                        <View style={styles.passwordHeading}>
                            <Text style={styles.label}>Password</Text>
                            <Pressable
                                onPress={() => setShowPassword(!showPassword)}
                                accessibilityRole="button"
                                accessibilityLabel={
                                    showPassword ? 'Hide password' : 'Show password'
                                }
                            >
                                <Text style={styles.textAction}>
                                    {showPassword ? 'Hide' : 'Show'}
                                </Text>
                            </Pressable>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            placeholderTextColor={colors.muted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            editable={!loading}
                            returnKeyType="done"
                            onSubmitEditing={handleLogin}
                        />

                        <Pressable
                            style={styles.forgotButton}
                            onPress={() => {
                                setError('Password recovery is not available yet.');
                            }}
                        >
                            <Text style={styles.textAction}>Forgot password?</Text>
                        </Pressable>

                        {error ? (
                            <Text accessibilityRole="alert" style={styles.error}>
                                {error}
                            </Text>
                        ) : null}

                        <Pressable
                            style={({ pressed }) => [
                                styles.loginButton,
                                pressed && styles.pressed,
                                loading && styles.disabled,
                            ]}
                            onPress={handleLogin}
                            disabled={loading}
                            accessibilityRole="button"
                        >
                            {loading ? (
                                <ActivityIndicator color={colors.surface} />
                            ) : (
                                <Text style={styles.loginButtonText}>Sign in  →</Text>
                            )}
                        </Pressable>

                        <View style={styles.signupRow}>
                            <Text style={styles.signupText}>New to Next Tutor? </Text>
                            <Pressable
                                onPress={() => router.push('/register')}
                            >
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
    forgotButton: {
        alignSelf: 'flex-end',
        marginTop: -10,
        marginBottom: 22,
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
