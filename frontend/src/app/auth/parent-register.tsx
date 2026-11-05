import { useState } from 'react';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '@/config/api';
import {
    ActivityIndicator,
    Alert,
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

type StudentForm = {
    fullName: string;
    gradeId: string;
    additionalNotes: string;
};

export default function ParentRegisterScreen() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Step 1: Parent Account State
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [city] = useState('Addis Ababa');
    const [subCity, setSubCity] = useState('');
    const [woreda, setWoreda] = useState('');
    const [village, setVillage] = useState('');

    // Step 2: Students State
    const [students, setStudents] = useState<StudentForm[]>([
        { fullName: '', gradeId: '', additionalNotes: '' },
    ]);

    const handleAddStudent = () => {
        setStudents([...students, { fullName: '', gradeId: '', additionalNotes: '' }]);
    };

    const handleStudentChange = (index: number, field: keyof StudentForm, value: string) => {
        const updated = [...students];
        updated[index][field] = value;
        setStudents(updated);
    };

    const handleRemoveStudent = (index: number) => {
        if (students.length === 1) {
            Alert.alert('Notice', 'At least one student profile is required.');
            return;
        }
        setStudents(students.filter((_, i) => i !== index));
    };

    const handleNextStep = () => {
        if (!username.trim() || !phoneNumber.trim() || !password.trim() || !subCity.trim()) {
            setErrorMessage('Please fill in your username, phone number, password, and sub-city.');
            return;
        }
        if (password.length < 8) {
            setErrorMessage('Password must be at least 8 characters long.');
            return;
        }
        setErrorMessage(null);
        setStep(2);
    };

    const handleSubmitRegistration = async () => {
        for (const [index, student] of students.entries()) {
            if (!student.fullName.trim() || !student.gradeId.trim()) {
                setErrorMessage(`Please fill out the full name and grade ID for Student #${index + 1}.`);
                return;
            }
        }

        setErrorMessage(null);
        setLoading(true);

        try {
            const payload = {
                username: username.trim(),
                phoneNumber: phoneNumber.trim(),
                password,
                email: email.trim() || undefined,
                city: city.trim(),
                subCity: subCity.trim(),
                woreda: woreda.trim() || undefined,
                village: village.trim() || undefined,
                students: students.map((s) => ({
                    fullName: s.fullName.trim(),
                    gradeId: s.gradeId.trim(),
                    additionalNotes: s.additionalNotes.trim() || undefined,
                })),
            };

            const response = await fetch(`${API_BASE_URL}/parents/register-parent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed.');
            }

            Alert.alert('Success!', 'Parent account and student profiles created successfully.', [
                {
                    text: 'Sign In',
                    onPress: () => router.replace('/auth/parent-login' as any),
                },
            ]);
        } catch (error: any) {
            setErrorMessage(error.message || 'Something went wrong during registration.');
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
                        <Text style={styles.eyebrow}>PARENT ONBOARDING</Text>
                        <Text style={styles.title}>
                            {step === 1 ? 'Create parent profile' : 'Add student profiles'}
                        </Text>
                        <Text style={styles.subtitle}>
                            {step === 1
                                ? 'Set up your account to hire verified local tutors.'
                                : 'Tell us about the children who need tutoring support.'}
                        </Text>
                    </View>

                    <View style={styles.card}>
                        {step === 1 ? (
                            <>
                                <Text style={styles.cardTitle}>Account details</Text>
                                <Text style={styles.cardSubtitle}>
                                    Enter your personal account and location details.
                                </Text>

                                <Text style={styles.label}>Username</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. abebe_parent"
                                    placeholderTextColor="#999"
                                    value={username}
                                    onChangeText={setUsername}
                                    autoCapitalize="none"
                                />

                                <Text style={styles.label}>Phone Number</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0911223344 or +251911223344"
                                    placeholderTextColor="#999"
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    keyboardType="phone-pad"
                                />

                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="At least 8 characters"
                                    placeholderTextColor="#999"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />

                                <Text style={styles.label}>Email (Optional)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. parent@gmail.com"
                                    placeholderTextColor="#999"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />

                                <Text style={[styles.cardTitle, { marginTop: 10, marginBottom: 15 }]}>
                                    Location
                                </Text>

                                <Text style={styles.label}>Sub-City</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Bole, Yeka, Lideta"
                                    placeholderTextColor="#999"
                                    value={subCity}
                                    onChangeText={setSubCity}
                                />

                                <Text style={styles.label}>Woreda (Optional)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Woreda 03"
                                    placeholderTextColor="#999"
                                    value={woreda}
                                    onChangeText={setWoreda}
                                />

                                <Text style={styles.label}>Sefer / Village Name (Optional)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. CMC Michael, Bole Bulbula"
                                    placeholderTextColor="#999"
                                    value={village}
                                    onChangeText={setVillage}
                                />

                                {errorMessage && (
                                    <Text style={styles.error}>{errorMessage}</Text>
                                )}

                                <Pressable
                                    style={({ pressed }) => [
                                        styles.loginButton,
                                        pressed && styles.pressed,
                                    ]}
                                    onPress={handleNextStep}
                                >
                                    <Text style={styles.loginButtonText}>Next: Add Students →</Text>
                                </Pressable>
                            </>
                        ) : (
                            <>
                                <View style={styles.studentStepHeader}>
                                    <Text style={styles.cardTitle}>Student profiles</Text>
                                    <Pressable onPress={handleAddStudent}>
                                        <Text style={styles.textAction}>+ Add another</Text>
                                    </Pressable>
                                </View>
                                <Text style={styles.cardSubtitle}>
                                    Register one or more students under your account.
                                </Text>

                                {students.map((student, index) => (
                                    <View key={index} style={styles.studentCardContainer}>
                                        <View style={styles.studentCardTop}>
                                            <Text style={styles.studentNumberLabel}>
                                                Student #{index + 1}
                                            </Text>
                                            {students.length > 1 && (
                                                <Pressable onPress={() => handleRemoveStudent(index)}>
                                                    <Text style={styles.removeText}>Remove</Text>
                                                </Pressable>
                                            )}
                                        </View>

                                        <Text style={styles.label}>Full Name</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Student full name"
                                            placeholderTextColor="#999"
                                            value={student.fullName}
                                            onChangeText={(val) =>
                                                handleStudentChange(index, 'fullName', val)
                                            }
                                        />

                                        <Text style={styles.label}>Grade ID</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Grade ID or grade name"
                                            placeholderTextColor="#999"
                                            value={student.gradeId}
                                            onChangeText={(val) =>
                                                handleStudentChange(index, 'gradeId', val)
                                            }
                                        />

                                        <Text style={styles.label}>Additional Notes (Optional)</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="e.g. Weak in mathematics & physics"
                                            placeholderTextColor="#999"
                                            value={student.additionalNotes}
                                            onChangeText={(val) =>
                                                handleStudentChange(index, 'additionalNotes', val)
                                            }
                                        />
                                    </View>
                                ))}

                                {errorMessage && (
                                    <Text style={styles.error}>{errorMessage}</Text>
                                )}

                                <View style={styles.buttonRow}>
                                    <Pressable
                                        style={[styles.backButton, styles.flex]}
                                        onPress={() => {
                                            setErrorMessage(null);
                                            setStep(1);
                                        }}
                                    >
                                        <Text style={styles.backButtonText}>← Back</Text>
                                    </Pressable>

                                    <Pressable
                                        style={[
                                            styles.loginButton,
                                            styles.flex,
                                            loading && styles.disabled,
                                        ]}
                                        onPress={handleSubmitRegistration}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color={colors.surface} />
                                        ) : (
                                            <Text style={styles.loginButtonText}>
                                                Complete Registration
                                            </Text>
                                        )}
                                    </Pressable>
                                </View>
                            </>
                        )}

                        <View style={styles.signupRow}>
                            <Text style={styles.signupText}>Already have an account? </Text>
                            <Pressable onPress={() => router.push('/auth/parent-login' as any)}>
                                <Text style={styles.textAction}>Sign in</Text>
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
    studentStepHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    studentCardContainer: {
        backgroundColor: '#FFF8F5',
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F7E9E1',
        marginBottom: 20,
    },
    studentCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    studentNumberLabel: {
        color: colors.primary,
        fontWeight: '800',
        fontSize: 14,
    },
    removeText: {
        color: '#C44C3B',
        fontSize: 13,
        fontWeight: '700',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
    },
    backButton: {
        minHeight: 56,
        borderRadius: 17,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonText: {
        color: colors.heading,
        fontSize: 15,
        fontWeight: '800',
    },
});