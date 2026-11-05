// src/app/tutor/home.tsx
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { logout } from '@/features/auth/api/logout';
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

type Offer = {
    id: string;
    grade: string;
    subjects: string[];
    location: string;
    schedule: string;
    pay: string;
    match: boolean;
};

const sampleOffers: Offer[] = [
    {
        id: '1',
        grade: 'Grade 8',
        subjects: ['Mathematics', 'Physics'],
        location: 'Bole, Addis Ababa',
        schedule: 'Weekdays · Afternoon',
        pay: 'Payment details available',
        match: true,
    },
    {
        id: '2',
        grade: 'Grade 10',
        subjects: ['Mathematics', 'Chemistry'],
        location: 'Kazanchis, Addis Ababa',
        schedule: 'Weekends · Morning',
        pay: 'Payment details available',
        match: false,
    },
    {
        id: '3',
        grade: 'Grade 6',
        subjects: ['All subjects'],
        location: 'Megenagna, Addis Ababa',
        schedule: 'Flexible schedule',
        pay: 'Payment details available',
        match: true,
    },
];

type AccountModalType = 'account' | 'logout' | 'error' | null;

export default function TutorHomeScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'recommended' | 'all'>(
        'recommended',
    );
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [activeNav, setActiveNav] = useState('Offers');
    const [loggingOut, setLoggingOut] = useState(false);
    const [accountModal, setAccountModal] = useState<AccountModalType>(null);

    const visibleOffers =
        activeTab === 'recommended'
            ? sampleOffers.filter((offer) => offer.match)
            : sampleOffers;

    async function handleLogout() {
        setLoggingOut(true);

        try {
            await logout();
            router.replace('/');
        } catch (error) {
            setAccountModal('error');
            Alert.alert(
                'Logout error',
                'Unable to clear to your local session. Please try again.'
            );
            console.error(error);
        } finally {
            setLoggingOut(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.brand}>Next Tutor</Text>
                        <Text style={styles.greeting}>Find your next opportunity.</Text>
                    </View>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Account options"
                        style={styles.avatar}
                        disabled={loggingOut}
                        onPress={() => setAccountModal('account')}
                    >
                        <Text style={styles.avatarText}>T</Text>
                    </Pressable>
                </View>

                <View style={styles.welcomeCard}>
                    <Text style={styles.welcomeEyebrow}>YOUR NEXT STUDENT</Text>
                    <Text style={styles.welcomeTitle}>
                        Great teaching starts with the right match.
                    </Text>
                    <Text style={styles.welcomeText}>
                        Explore opportunities that fit your skills and location.
                    </Text>
                </View>

                <View style={styles.sectionHeading}>
                    <View>
                        <Text style={styles.sectionTitle}>Tutoring offers</Text>
                        <Text style={styles.sectionSubtitle}>
                            Choose an offer that works for you.
                        </Text>
                    </View>
                    <Text style={styles.count}>{visibleOffers.length} offers</Text>
                </View>

                <View style={styles.tabs}>
                    <Pressable
                        onPress={() => {
                            setActiveTab('recommended');
                            setSelectedOffer(null);
                        }}
                        style={[
                            styles.tab,
                            activeTab === 'recommended' && styles.activeTab,
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'recommended' && styles.activeTabText,
                            ]}
                        >
                            For You
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => {
                            setActiveTab('all');
                            setSelectedOffer(null);
                        }}
                        style={[styles.tab, activeTab === 'all' && styles.activeTab]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'all' && styles.activeTabText,
                            ]}
                        >
                            All Offers
                        </Text>
                    </Pressable>
                </View>

                {activeTab === 'recommended' && (
                    <Text style={styles.matchNote}>
                        Suggested using your registered preferences. These are sample
                        results for now.
                    </Text>
                )}

                {visibleOffers.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>No offers yet</Text>
                        <Text style={styles.emptyText}>
                            New opportunities will appear here. You can check all offers in
                            the meantime.
                        </Text>
                        <Pressable
                            style={styles.primaryButton}
                            onPress={() => setActiveTab('all')}
                        >
                            <Text style={styles.primaryButtonText}>Explore all offers</Text>
                        </Pressable>
                    </View>
                ) : (
                    visibleOffers.map((offer) => (
                        <View key={offer.id} style={styles.offerCard}>
                            <View style={styles.offerTop}>
                                <View style={styles.gradeBadge}>
                                    <Text style={styles.gradeText}>{offer.grade}</Text>
                                </View>
                                {offer.match && (
                                    <Text style={styles.matchBadge}>Suggested</Text>
                                )}
                            </View>

                            <Text style={styles.offerTitle}>
                                {offer.subjects.join(' & ')}
                            </Text>

                            <Text style={styles.offerDetail}>⌖ {offer.location}</Text>
                            <Text style={styles.offerDetail}>◷ {offer.schedule}</Text>

                            <View style={styles.offerDivider} />

                            <View style={styles.offerBottom}>
                                <View style={styles.payInfo}>
                                    <Text style={styles.payLabel}>PAYMENT</Text>
                                    <Text style={styles.payText}>{offer.pay}</Text>
                                </View>

                                <Pressable
                                    accessibilityRole="button"
                                    onPress={() => setSelectedOffer(offer)}
                                    style={styles.viewButton}
                                >
                                    <Text style={styles.viewButtonText}>View offer →</Text>
                                </Pressable>
                            </View>
                        </View>
                    ))
                )}

                <Text style={styles.footer}>
                    Your skills can open someone&apos;s future.
                </Text>
            </ScrollView>

            <Modal
                visible={selectedOffer !== null}
                transparent
                animationType="fade"
                statusBarTranslucent
                onRequestClose={() => setSelectedOffer(null)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={() => setSelectedOffer(null)}
                        accessibilityRole="button"
                        accessibilityLabel="Close offer details"
                    />

                    {selectedOffer && (
                        <View style={styles.detailCard}>
                            <View style={styles.detailHeader}>
                                <Text style={styles.sectionTitle}>Offer details</Text>

                                <Pressable onPress={() => setSelectedOffer(null)}>
                                    <Text style={styles.closeText}>Close ✕</Text>
                                </Pressable>
                            </View>

                            <Text style={styles.detailTitle}>{selectedOffer.grade}</Text>

                            <Text style={styles.detailText}>
                                Subjects: {selectedOffer.subjects.join(', ')}
                            </Text>
                            <Text style={styles.detailText}>
                                Location: {selectedOffer.location}
                            </Text>
                            <Text style={styles.detailText}>
                                Schedule: {selectedOffer.schedule}
                            </Text>
                            <Text style={styles.detailText}>
                                {selectedOffer.pay}
                            </Text>

                            <Pressable
                                style={styles.primaryButton}
                                onPress={() => {
                                    setSelectedOffer(null);
                                    // Application flow will be implemented next.
                                }}
                            >
                                <Text style={styles.primaryButtonText}>
                                    Apply for this offer
                                </Text>
                            </Pressable>

                            <Text style={styles.helperText}>
                                Applications aren&apos;t submitted yet in this prototype.
                            </Text>
                        </View>
                    )}
                </View>
            </Modal>

            <Modal
                visible={accountModal !== null}
                transparent
                animationType="fade"
                statusBarTranslucent
                onRequestClose={() => setAccountModal(null)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={() => setAccountModal(null)}
                        accessibilityRole="button"
                        accessibilityLabel="Close dialog"
                    />

                    <View style={styles.accountModal}>
                        {accountModal === 'account' && (
                            <>
                                <View style={styles.accountIcon}>
                                    <Text style={styles.accountIconText}>T</Text>
                                </View>

                                <Text style={styles.accountTitle}>Your account</Text>
                                <Text style={styles.accountDescription}>
                                    Manage your NextTutor account.
                                </Text>

                                <Pressable
                                    style={styles.accountOption}
                                    onPress={() => {
                                        setAccountModal(null);
                                        setActiveNav('Profile');
                                    }}
                                >
                                    <Text style={styles.accountOptionText}>
                                        View profile
                                    </Text>
                                    <Text style={styles.accountArrow}>›</Text>
                                </Pressable>

                                <Pressable
                                    style={styles.logoutOption}
                                    onPress={() => setAccountModal('logout')}
                                >
                                    <Text style={styles.logoutOptionText}>Log out</Text>
                                </Pressable>
                            </>
                        )}

                        {accountModal === 'logout' && (
                            <>
                                <Text style={styles.accountTitle}>Log out?</Text>
                                <Text style={styles.accountDescription}>
                                    Are you sure you want to log out of your account?
                                </Text>

                                <Pressable
                                    style={styles.dangerButton}
                                    disabled={loggingOut}
                                    onPress={handleLogout}
                                >
                                    <Text style={styles.dangerButtonText}>
                                        {loggingOut ? 'Logging out...' : 'Yes, log out'}
                                    </Text>
                                </Pressable>

                                <Pressable
                                    style={styles.cancelButton}
                                    disabled={loggingOut}
                                    onPress={() => setAccountModal('account')}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </Pressable>
                            </>
                        )}

                        {accountModal === 'error' && (
                            <>
                                <Text style={styles.accountTitle}>Logout error</Text>
                                <Text style={styles.accountDescription}>
                                    Unable to clear your local session. Please try again.
                                </Text>

                                <Pressable
                                    style={styles.primaryButton}
                                    onPress={() => setAccountModal(null)}
                                >
                                    <Text style={styles.primaryButtonText}>Close</Text>
                                </Pressable>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            <View style={styles.bottomNav}>
                {[
                    { label: 'Offers', symbol: '⌂' },
                    { label: 'Applications', symbol: '▤' },
                    { label: 'Profile', symbol: '○' },
                ].map((item) => (
                    <Pressable
                        key={item.label}
                        onPress={() => setActiveNav(item.label)}
                        style={styles.navItem}
                    >
                        <Text
                            style={[
                                styles.navSymbol,
                                activeNav === item.label && styles.navActive,
                            ]}
                        >
                            {item.symbol}
                        </Text>
                        <Text
                            style={[
                                styles.navLabel,
                                activeNav === item.label && styles.navActive,
                            ]}
                        >
                            {item.label}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    accountModal: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: colors.border,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
    },

    accountIcon: {
        width: 54,
        height: 54,
        borderRadius: 18,
        backgroundColor: colors.softOrange,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 16,
    },

    accountIconText: {
        color: colors.primary,
        fontSize: 21,
        fontWeight: '800',
    },

    accountTitle: {
        color: colors.heading,
        fontSize: 21,
        fontWeight: '800',
        textAlign: 'center',
    },

    accountDescription: {
        color: colors.muted,
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 20,
    },

    accountOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF4EE',
        padding: 15,
        borderRadius: 13,
    },

    accountOptionText: {
        color: colors.heading,
        fontSize: 14,
        fontWeight: '700',
    },

    accountArrow: {
        color: colors.primary,
        fontSize: 22,
    },

    logoutOption: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
        marginTop: 10,
    },

    logoutOptionText: {
        color: '#C44C3B',
        fontSize: 14,
        fontWeight: '700',
    },

    dangerButton: {
        backgroundColor: '#C44C3B',
        borderRadius: 14,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },

    dangerButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
    },

    cancelButton: {
        minHeight: 46,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
    },

    cancelButtonText: {
        color: colors.muted,
        fontSize: 14,
        fontWeight: '700',
    },
    brand: {
        color: colors.primary,
        fontSize: 22,
        fontWeight: '800',
    },
    greeting: {
        color: colors.text,
        fontSize: 13,
        marginTop: 5,
    },
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: colors.softOrange,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: '800',
    },
    welcomeCard: {
        backgroundColor: colors.primary,
        borderRadius: 24,
        padding: 22,
        marginBottom: 28,
    },
    welcomeEyebrow: {
        color: '#FFE0CF',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.5,
    },
    welcomeTitle: {
        color: '#FFFFFF',
        fontSize: 25,
        fontWeight: '800',
        lineHeight: 32,
        marginTop: 12,
    },
    welcomeText: {
        color: '#FFF0E8',
        fontSize: 14,
        lineHeight: 21,
        marginTop: 10,
    },
    sectionHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    sectionTitle: {
        color: colors.heading,
        fontSize: 20,
        fontWeight: '800',
    },
    sectionSubtitle: {
        color: colors.muted,
        fontSize: 12,
        marginTop: 5,
    },
    count: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: '700',
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#F3E5DE',
        borderRadius: 14,
        padding: 4,
        marginBottom: 12,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 43,
        borderRadius: 11,
    },
    activeTab: {
        backgroundColor: colors.surface,
    },
    tabText: {
        color: colors.text,
        fontSize: 13,
        fontWeight: '700',
    },
    activeTabText: {
        color: colors.primary,
    },
    matchNote: {
        color: colors.muted,
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 14,
    },
    offerCard: {
        backgroundColor: colors.surface,
        borderRadius: 22,
        padding: 18,
        borderWidth: 1,
        borderColor: '#F7E9E1',
        marginBottom: 14,
    },
    offerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    gradeBadge: {
        backgroundColor: colors.softOrange,
        paddingHorizontal: 11,
        paddingVertical: 7,
        borderRadius: 9,
    },
    gradeText: {
        color: colors.primaryDark,
        fontSize: 12,
        fontWeight: '800',
    },
    matchBadge: {
        color: '#38734A',
        backgroundColor: '#E8F4E9',
        paddingHorizontal: 9,
        paddingVertical: 6,
        borderRadius: 9,
        fontSize: 10,
        fontWeight: '700',
    },
    offerTitle: {
        color: colors.heading,
        fontSize: 18,
        fontWeight: '800',
        marginTop: 15,
        marginBottom: 12,
    },
    offerDetail: {
        color: colors.text,
        fontSize: 13,
        marginBottom: 9,
    },
    offerDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 12,
    },
    offerBottom: {
        gap: 12,
    },
    payInfo: {
        gap: 4,
    },
    payLabel: {
        color: colors.muted,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    payText: {
        color: colors.text,
        fontSize: 12,
    },
    viewButton: {
        minHeight: 45,
        borderRadius: 13,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    viewButtonText: {
        color: colors.surface,
        fontSize: 13,
        fontWeight: '800',
    },
    emptyCard: {
        backgroundColor: colors.surface,
        borderRadius: 22,
        padding: 22,
        alignItems: 'center',
    },
    emptyTitle: {
        color: colors.heading,
        fontSize: 18,
        fontWeight: '800',
    },
    emptyText: {
        color: colors.text,
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'center',
        marginTop: 9,
        marginBottom: 18,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    detailCard: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: colors.surface,
        borderRadius: 22,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
    },
    detailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    closeText: {
        color: colors.primary,
        fontWeight: '700',
        fontSize: 12,
    },
    detailTitle: {
        color: colors.heading,
        fontSize: 17,
        fontWeight: '800',
        marginBottom: 12,
    },
    detailText: {
        color: colors.text,
        fontSize: 13,
        lineHeight: 21,
        marginBottom: 6,
    },
    primaryButton: {
        backgroundColor: colors.primary,
        borderRadius: 14,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        marginTop: 18,
    },
    primaryButtonText: {
        color: colors.surface,
        fontWeight: '800',
        fontSize: 14,
    },
    helperText: {
        color: colors.muted,
        fontSize: 11,
        lineHeight: 17,
        textAlign: 'center',
        marginTop: 10,
    },
    footer: {
        color: colors.muted,
        textAlign: 'center',
        fontSize: 12,
        marginTop: 12,
        marginBottom: 16,
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 10,
        paddingBottom: 8,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
        paddingVertical: 4,
    },
    navSymbol: {
        color: colors.muted,
        fontSize: 21,
    },
    navLabel: {
        color: colors.muted,
        fontSize: 10,
        fontWeight: '600',
    },
    navActive: {
        color: colors.primary,
        fontWeight: '800',
    },
});