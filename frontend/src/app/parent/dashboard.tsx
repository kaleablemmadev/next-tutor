import { useState } from 'react';
import { useRouter } from 'expo-router';
import { clearSession } from '@/features/auth/services/session';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    Pressable,
    View,
} from 'react-native';
import { colors } from '@/theme/colors';

export default function ParentDashboard() {
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await clearSession();
            router.replace('/');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.brand}>Next Tutor</Text>
                        <Text style={styles.greeting}>Parent Portal</Text>
                    </View>

                    <Pressable
                        style={styles.logoutButton}
                        onPress={handleLogout}
                        disabled={loggingOut}
                    >
                        <Text style={styles.logoutText}>Logout</Text>
                    </Pressable>
                </View>

                <View style={styles.welcomeCard}>
                    <Text style={styles.welcomeEyebrow}>DASHBOARD</Text>
                    <Text style={styles.welcomeTitle}>Manage your children&apos;s learning.</Text>
                    <Text style={styles.welcomeText}>
                        Post tutoring offers and connect with verified local tutors near you.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    content: { padding: 20 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    brand: { color: colors.primary, fontSize: 22, fontWeight: '800' },
    greeting: { color: colors.text, fontSize: 13, marginTop: 3 },
    logoutButton: {
        backgroundColor: '#FFF4EE',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#F7E9E1',
    },
    logoutText: { color: '#C44C3B', fontWeight: '700', fontSize: 13 },
    welcomeCard: {
        backgroundColor: colors.primary,
        borderRadius: 24,
        padding: 22,
        marginBottom: 28,
    },
    welcomeEyebrow: { color: '#FFE0CF', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
    welcomeTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginTop: 10 },
    welcomeText: { color: '#FFF0E8', fontSize: 14, marginTop: 8, lineHeight: 20 },
});