import React, { useState, useRef, useEffect } from 'react';
import {
  Animated, Easing, ScrollView, StyleSheet, View, Text,
  TouchableOpacity, Switch, Dimensions, Platform, StatusBar,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import Svg, { Path, Circle, Rect, Ellipse, G } from 'react-native-svg';

const { width: W } = Dimensions.get('window');

// ─── Brand Colors ─────────────────────────────────────────────────────────────
const BLUE = '#0055FF';
const PURPLE = '#7C3AED';
const TEAL = '#0EA5E9';
const GREEN = '#059669';
const AMBER = '#D97706';
const RED = '#DC2626';

// ─── Data ─────────────────────────────────────────────────────────────────────

const COMPANY_STATS = [
  { value: 247, label: 'Projects', suffix: '', color: BLUE },
  { value: 180, label: 'Clients', suffix: '+', color: PURPLE },
  { value: 6, label: 'Countries', suffix: '', color: GREEN },
  { value: 200, label: 'Team', suffix: '+', color: AMBER },
];

const LEADERSHIP = [
  {
    initials: 'RA',
    name: 'Rasha Aljalam',
    role: 'CEO & Co-founder',
    credential: '15 years enterprise AI, ex-McKinsey',
    gradient: ['#0D1B4B', '#0055FF'] as const,
    accentColor: BLUE,
  },
  {
    initials: 'KM',
    name: 'Khalid Al-Mansouri',
    role: 'CTO',
    credential: 'Arabic NLP pioneer, ex-Google Brain',
    gradient: ['#2E1B5E', '#7C3AED'] as const,
    accentColor: PURPLE,
  },
  {
    initials: 'SC',
    name: 'Sarah Chen',
    role: 'Head of Delivery',
    credential: 'Delivered 80+ AI projects across GCC',
    gradient: ['#064E3B', '#059669'] as const,
    accentColor: GREEN,
  },
];

const CLIENTS = [
  { name: 'Emirates NBD', color: BLUE },
  { name: 'ADNOC', color: GREEN },
  { name: 'Dubai Municipality', color: PURPLE },
  { name: 'Etisalat', color: TEAL },
  { name: 'DEWA', color: AMBER },
  { name: 'RTA Dubai', color: RED },
];

const CERTIFICATIONS = [
  { name: 'ISO 27001', sub: 'Information Security', color: BLUE },
  { name: 'Microsoft Gold Partner', sub: 'Cloud & AI', color: PURPLE },
  { name: 'Google Cloud Partner', sub: 'Machine Learning', color: GREEN },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function ShieldCheckIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22C12 22 4 18 4 12V5L12 2L20 5V12C20 18 12 22 12 22Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 12L11 14L15 10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MapPinIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke={color} strokeWidth="1.8" />
      <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.8" />
    </Svg>
  );
}

function MailIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.8" />
      <Path d="M2 8L12 14L22 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

function PhoneIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.95 13a19.79 19.79 0 01-3.07-8.67A2 2 0 012.86 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MoonIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill={color + '20'} />
    </Svg>
  );
}

function ArrowRightIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── AnimatedCounter ──────────────────────────────────────────────────────────

function AnimatedCounter({
  target, suffix = '', color,
}: {
  target: number; suffix?: string; color: string;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const id = anim.addListener(({ value }) => setDisplay(Math.round(value).toString()));
    Animated.timing(anim, {
      toValue: target,
      duration: 1200,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();
    return () => anim.removeListener(id);
  }, []);

  return (
    <Text style={[styles.statValue, { color }]}>{display}{suffix}</Text>
  );
}

// ─── Leader Card ──────────────────────────────────────────────────────────────

function LeaderCard({ person, colors }: { person: typeof LEADERSHIP[0]; colors: any }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, damping: 14 }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 12 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[styles.leaderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <LinearGradient
          colors={person.gradient}
          style={styles.leaderAvatarWrap}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.leaderInitials}>{person.initials}</Text>
        </LinearGradient>
        <Text style={[styles.leaderName, { color: colors.text }]}>{person.name}</Text>
        <Text style={[styles.leaderRole, { color: colors.textSecondary }]}>{person.role}</Text>
        <View
          style={[
            styles.credentialTag,
            {
              backgroundColor: person.accentColor + '15',
              borderColor: person.accentColor + '35',
            },
          ]}
        >
          <Text style={[styles.credentialText, { color: person.accentColor }]}>
            {person.credential}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Contact Row ──────────────────────────────────────────────────────────────

function ContactRow({
  icon, label, onPress, colors, isLast,
}: {
  icon: string; label: string; onPress: () => void; colors: any; isLast: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, damping: 14 }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 12 }).start();

  return (
    <>
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={styles.contactRow}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
          }}
          activeOpacity={1}
        >
          <View style={[styles.contactIconWrap, { backgroundColor: colors.primary + '15' }]}>
            {icon === 'map' && <MapPinIcon color={colors.primary} />}
            {icon === 'mail' && <MailIcon color={colors.primary} />}
            {icon === 'phone' && <PhoneIcon color={colors.primary} />}
          </View>
          <Text style={[styles.contactLabel, { color: colors.text }]} numberOfLines={1}>
            {label}
          </Text>
          <ArrowRightIcon color={colors.textMuted} />
        </TouchableOpacity>
      </Animated.View>
      {!isLast && (
        <View style={[styles.contactDivider, { backgroundColor: colors.borderLight }]} />
      )}
    </>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AboutScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const heroAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heroAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          delay: 200,
          useNativeDriver: true,
          damping: 14,
          stiffness: 120,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
      ]),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  const handleThemeToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  const logoRotateDeg = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-8deg', '0deg'],
  });

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Hero ── */}
        <Animated.View
          style={{
            opacity: heroAnim,
            transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
          }}
        >
          <LinearGradient
            colors={['#020818', '#0D1B4B', '#0055FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            {/* Decorative SVG circles */}
            <Svg style={StyleSheet.absoluteFill as any} width={W} height={240} pointerEvents="none">
              <Ellipse cx={W * 0.88} cy={50} rx={110} ry={110} fill="rgba(124,58,237,0.2)" />
              <Ellipse cx={W * 0.08} cy={220} rx={80} ry={80} fill="rgba(14,165,233,0.12)" />
              <Circle cx={W * 0.5} cy={240} r={140} stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
              <Circle cx={W * 0.5} cy={240} r={90} stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
              <Circle cx={W * 0.15} cy={80} r={12} fill="rgba(255,255,255,0.08)" />
              <Circle cx={W * 0.82} cy={180} r={8} fill="rgba(255,255,255,0.06)" />
              <Circle cx={W * 0.42} cy={30} r={5} fill="rgba(255,255,255,0.1)" />
            </Svg>

            {/* Animated WT Logo */}
            <Animated.View
              style={{
                transform: [{ scale: logoScale }, { rotate: logoRotateDeg }],
              }}
            >
              <LinearGradient
                colors={[PURPLE, BLUE]}
                style={styles.logoCircle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.logoText}>WT</Text>
              </LinearGradient>
            </Animated.View>

            <Text style={styles.heroCompanyName}>WeThink.ae</Text>
            <Text style={styles.heroTagline}>
              The Middle East's Leading AI Consultancy
            </Text>

            <View style={styles.foundedBadge}>
              <View style={styles.foundedDot} />
              <Text style={styles.foundedText}>Est. 2019 · Dubai Internet City, UAE</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── Stats Row ── */}
        <Animated.View
          style={[
            styles.statsBar,
            { backgroundColor: colors.surface, borderColor: colors.border },
            { opacity: contentAnim },
          ]}
        >
          {COMPANY_STATS.map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i > 0 && <View style={[styles.statDivider, { backgroundColor: colors.borderLight }]} />}
              <View style={styles.statItem}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} color={stat.color} />
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>{stat.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </Animated.View>

        {/* ── Mission ── */}
        <View style={[styles.section, { paddingHorizontal: 24 }]}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionAccent, { backgroundColor: BLUE }]} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Mission</Text>
          </View>
          <View
            style={[
              styles.missionCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderLeftColor: BLUE,
              },
            ]}
          >
            <Text style={[styles.missionText, { color: colors.textSecondary }]}>
              "We exist to make enterprise AI accessible, ethical and impactful across the Middle East. We believe AI should create real value for real people — not just technical showcases."
            </Text>
          </View>
        </View>

        {/* ── Leadership ── */}
        <View style={styles.section}>
          <View style={[styles.sectionTitleRow, { paddingHorizontal: 24 }]}>
            <View style={[styles.sectionAccent, { backgroundColor: PURPLE }]} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Leadership Team</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.leadershipRow}
          >
            {LEADERSHIP.map((person, i) => (
              <LeaderCard key={i} person={person} colors={colors} />
            ))}
          </ScrollView>
        </View>

        {/* ── Trusted By ── */}
        <View style={[styles.section, { paddingHorizontal: 24 }]}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionAccent, { backgroundColor: TEAL }]} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Trusted By</Text>
          </View>
          <View style={styles.clientGrid}>
            {CLIENTS.map(client => (
              <TouchableOpacity
                key={client.name}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                style={[
                  styles.clientChip,
                  {
                    backgroundColor: client.color + '12',
                    borderColor: client.color + '35',
                  },
                ]}
                activeOpacity={0.75}
              >
                <View style={[styles.clientDot, { backgroundColor: client.color }]} />
                <Text style={[styles.clientName, { color: client.color }]}>{client.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Certifications ── */}
        <View style={[styles.section, { paddingHorizontal: 24 }]}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionAccent, { backgroundColor: GREEN }]} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Certifications</Text>
          </View>
          <View style={styles.certRow}>
            {CERTIFICATIONS.map(cert => (
              <View
                key={cert.name}
                style={[
                  styles.certCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <LinearGradient
                  colors={[cert.color + '20', cert.color + '08']}
                  style={styles.certIconWrap}
                >
                  <ShieldCheckIcon color={cert.color} size={22} />
                </LinearGradient>
                <Text style={[styles.certName, { color: colors.text }]} numberOfLines={2}>
                  {cert.name}
                </Text>
                <Text style={[styles.certSub, { color: colors.textMuted }]}>{cert.sub}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Contact ── */}
        <View style={[styles.section, { paddingHorizontal: 24 }]}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionAccent, { backgroundColor: AMBER }]} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Us</Text>
          </View>
          <View
            style={[
              styles.contactCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <ContactRow
              icon="map"
              label="Dubai Internet City, Building 4, UAE"
              onPress={() => {}}
              colors={colors}
              isLast={false}
            />
            <ContactRow
              icon="mail"
              label="hello@wethink.ae"
              onPress={() => Linking.openURL('mailto:hello@wethink.ae')}
              colors={colors}
              isLast={false}
            />
            <ContactRow
              icon="phone"
              label="+971 4 330 9000"
              onPress={() => Linking.openURL('tel:+97143309000')}
              colors={colors}
              isLast={true}
            />
          </View>
        </View>

        {/* ── App Preferences ── */}
        <View style={[styles.section, { paddingHorizontal: 24 }]}>
          <View
            style={[
              styles.themeRow,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.themeRowLeft}>
              <View
                style={[
                  styles.themeIconWrap,
                  {
                    backgroundColor: isDark ? colors.accentLight : colors.primaryLight,
                  },
                ]}
              >
                <MoonIcon
                  color={isDark ? colors.accent : colors.primary}
                  size={18}
                />
              </View>
              <View>
                <Text style={[styles.themeLabel, { color: colors.text }]}>Dark Mode</Text>
                <Text style={[styles.themeSub, { color: colors.textMuted }]}>
                  {isDark ? 'Currently dark theme' : 'Currently light theme'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={handleThemeToggle}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={isDark ? colors.primary : colors.textMuted}
              ios_backgroundColor={colors.border}
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <LinearGradient
            colors={[BLUE, PURPLE]}
            style={styles.footerLogoBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.footerLogoText}>WT</Text>
          </LinearGradient>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            WeThink.ae © 2019–2026
          </Text>
          <Text style={[styles.footerSub, { color: colors.textMuted }]}>
            The Middle East's Leading AI Consultancy
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: 24 },
  section: { marginTop: 28 },

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionAccent: { width: 4, height: 22, borderRadius: 2 },
  sectionTitle: { fontSize: 21, fontWeight: '900', letterSpacing: -0.5 },

  // Hero
  hero: {
    height: 240 + (Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 24),
    paddingTop: Platform.OS === 'ios' ? 56 : (StatusBar.currentHeight ?? 24) + 12,
    alignItems: 'center',
    overflow: 'hidden',
    paddingBottom: 32,
    justifyContent: 'flex-end',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: BLUE,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  logoText: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  heroCompanyName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  heroTagline: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 18,
  },
  foundedBadge: {
    marginTop: 14,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  foundedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
  foundedText: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '700' },

  // Stats
  statsBar: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 18 },
  statValue: { fontSize: 21, fontWeight: '900', letterSpacing: -0.5 },
  statLabel: { fontSize: 10, fontWeight: '600', marginTop: 3 },
  statDivider: { width: 1, marginVertical: 14 },

  // Mission
  missionCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  missionText: {
    fontSize: 15,
    lineHeight: 24,
    fontStyle: 'italic',
    fontWeight: '500',
    letterSpacing: 0.1,
  },

  // Leadership
  leadershipRow: { paddingHorizontal: 24, paddingBottom: 4, gap: 12 },
  leaderCard: {
    width: 165,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  leaderAvatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  leaderInitials: { color: '#fff', fontSize: 22, fontWeight: '900' },
  leaderName: {
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  leaderRole: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 10,
  },
  credentialTag: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  credentialText: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 14,
  },

  // Clients
  clientGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  clientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1,
  },
  clientDot: { width: 7, height: 7, borderRadius: 3.5 },
  clientName: { fontSize: 13, fontWeight: '700' },

  // Certifications
  certRow: { flexDirection: 'row', gap: 10 },
  certCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  certIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  certName: {
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  certSub: { fontSize: 10, textAlign: 'center', fontWeight: '500' },

  // Contact
  contactCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    gap: 14,
  },
  contactIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactLabel: { flex: 1, fontSize: 14, fontWeight: '600' },
  contactDivider: { height: 1, marginLeft: 70 },

  // Theme toggle
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  themeRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  themeIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeLabel: { fontSize: 15, fontWeight: '700' },
  themeSub: { fontSize: 12, marginTop: 1 },

  // Footer
  footer: { alignItems: 'center', marginTop: 36, gap: 8 },
  footerLogoBadge: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  footerLogoText: { color: '#fff', fontSize: 14, fontWeight: '900' },
  footerText: { fontSize: 13, fontWeight: '600' },
  footerSub: { fontSize: 11 },
});
