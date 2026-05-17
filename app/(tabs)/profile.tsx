import React, { useState, useRef, useEffect } from 'react';
import {
  Animated, Easing, ScrollView, StyleSheet, View, Text,
  TouchableOpacity, Switch, Dimensions, Platform, StatusBar,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

const { width: W } = Dimensions.get('window');

// ─── Data ─────────────────────────────────────────────────────────────────────

const COMPANY_STATS = [
  { value: 247, label: 'Projects', suffix: '', color: '#0055FF' },
  { value: 180, label: 'Clients', suffix: '', color: '#7C3AED' },
  { value: 6, label: 'Countries', suffix: '', color: '#059669' },
  { value: 200, label: 'Team', suffix: '+', color: '#D97706' },
];

const LEADERSHIP = [
  {
    initials: 'RA',
    name: 'Rasha Aljalam',
    role: 'CEO & Co-founder',
    credential: '15 years in enterprise AI',
    gradient: ['#0D1B4B', '#0055FF'] as const,
    accentColor: '#0055FF',
  },
  {
    initials: 'KM',
    name: 'Khalid Al-Mansouri',
    role: 'CTO',
    credential: 'Ex-Google Brain, Arabic NLP pioneer',
    gradient: ['#2E1B5E', '#7C3AED'] as const,
    accentColor: '#7C3AED',
  },
  {
    initials: 'SC',
    name: 'Sarah Chen',
    role: 'Head of Delivery',
    credential: 'Delivered 80+ AI projects',
    gradient: ['#064E3B', '#059669'] as const,
    accentColor: '#059669',
  },
];

const CLIENTS = [
  { name: 'Emirates NBD', color: '#0055FF' },
  { name: 'ADNOC', color: '#059669' },
  { name: 'Dubai Municipality', color: '#7C3AED' },
  { name: 'Etisalat', color: '#D97706' },
  { name: 'DEWA', color: '#DC2626' },
  { name: 'RTA Dubai', color: '#0EA5E9' },
];

const CERTIFICATIONS = [
  { name: 'ISO 27001', sub: 'Information Security', color: '#0055FF' },
  { name: 'Microsoft Gold Partner', sub: 'Cloud & AI', color: '#7C3AED' },
  { name: 'Google Cloud Partner', sub: 'Machine Learning', color: '#059669' },
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

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix = '', color, labelStyle, valueStyle }: {
  target: number; suffix?: string; color: string; labelStyle: any; valueStyle: any;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const listener = anim.addListener(({ value }) => {
      setDisplay(Math.round(value).toString());
    });
    Animated.timing(anim, { toValue: target, duration: 1300, useNativeDriver: false, easing: Easing.out(Easing.cubic) }).start();
    return () => anim.removeListener(listener);
  }, []);

  return (
    <Text style={[valueStyle, { color }]}>{display}{suffix}</Text>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AboutScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const heroAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(heroAnim, { toValue: 1, duration: 500, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
      Animated.timing(contentAnim, { toValue: 1, duration: 400, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
    ]).start();
  }, []);

  const handleThemeToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Hero Banner ── */}
        <Animated.View style={{ opacity: heroAnim, transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }}>
          <LinearGradient colors={['#020818', '#0D1B4B', '#0055FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
            {/* Decorative circles */}
            <View style={[styles.heroCircle, styles.heroCircle1]} />
            <View style={[styles.heroCircle, styles.heroCircle2]} />

            {/* Logo */}
            <LinearGradient colors={['#7C3AED', '#0055FF']} style={styles.logoCircle} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={styles.logoText}>WT</Text>
            </LinearGradient>
            <Text style={styles.heroCompanyName}>WeThink.ae</Text>
            <Text style={styles.heroTagline}>The Middle East's Leading AI Consultancy</Text>
            <View style={styles.foundedBadge}>
              <Text style={styles.foundedText}>Est. 2019 · Dubai, UAE</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── Stats Bar ── */}
        <Animated.View style={[styles.statsBar, { backgroundColor: colors.surface, borderColor: colors.border }, { opacity: contentAnim }]}>
          {COMPANY_STATS.map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i > 0 && <View style={[styles.statDivider, { backgroundColor: colors.border }]} />}
              <View style={styles.statItem}>
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  color={stat.color}
                  valueStyle={styles.statValue}
                  labelStyle={styles.statLabel}
                />
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>{stat.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </Animated.View>

        {/* ── Our Mission ── */}
        <View style={[styles.section, { paddingHorizontal: 24 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Mission</Text>
          <View style={[styles.missionCard, { backgroundColor: colors.surface, borderColor: colors.border, borderLeftColor: '#0055FF' }]}>
            <Text style={[styles.missionText, { color: colors.textSecondary }]}>
              "We exist to make enterprise AI accessible, ethical, and impactful across the Middle East. Every solution we build creates real value for real people."
            </Text>
          </View>
        </View>

        {/* ── Leadership Team ── */}
        <View style={[styles.section]}>
          <Text style={[styles.sectionTitle, { color: colors.text, paddingHorizontal: 24 }]}>Leadership Team</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.leadershipRow}>
            {LEADERSHIP.map((person, i) => (
              <View key={i} style={[styles.leaderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <LinearGradient colors={person.gradient} style={styles.leaderAvatar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Text style={styles.leaderInitials}>{person.initials}</Text>
                </LinearGradient>
                <Text style={[styles.leaderName, { color: colors.text }]}>{person.name}</Text>
                <Text style={[styles.leaderRole, { color: colors.textSecondary }]}>{person.role}</Text>
                <View style={[styles.credentialTag, { backgroundColor: person.accentColor + '15', borderColor: person.accentColor + '40' }]}>
                  <Text style={[styles.credentialText, { color: person.accentColor }]}>{person.credential}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── Trusted By ── */}
        <View style={[styles.section, { paddingHorizontal: 24 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trusted By</Text>
          <View style={styles.clientGrid}>
            {CLIENTS.map(client => (
              <View key={client.name} style={[styles.clientChip, { backgroundColor: client.color + '12', borderColor: client.color + '35' }]}>
                <View style={[styles.clientDot, { backgroundColor: client.color }]} />
                <Text style={[styles.clientName, { color: client.color }]}>{client.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Certifications ── */}
        <View style={[styles.section, { paddingHorizontal: 24 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Certifications</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.certRow}>
            {CERTIFICATIONS.map(cert => (
              <View key={cert.name} style={[styles.certCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.certIconWrap, { backgroundColor: cert.color + '15' }]}>
                  <ShieldCheckIcon color={cert.color} size={22} />
                </View>
                <Text style={[styles.certName, { color: colors.text }]}>{cert.name}</Text>
                <Text style={[styles.certSub, { color: colors.textMuted }]}>{cert.sub}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── Contact Strip ── */}
        <View style={[styles.section, { paddingHorizontal: 24 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Us</Text>
          <View style={[styles.contactCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {[
              { icon: 'map', label: 'Dubai Internet City, UAE', onPress: () => {} },
              { icon: 'mail', label: 'hello@wethink.ae', onPress: () => Linking.openURL('mailto:hello@wethink.ae') },
              { icon: 'phone', label: '+971 4 XXX XXXX', onPress: () => Linking.openURL('tel:+9714XXXXXXX') },
            ].map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={[styles.contactDivider, { backgroundColor: colors.borderLight }]} />}
                <TouchableOpacity
                  style={styles.contactRow}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); item.onPress(); }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.contactIconWrap, { backgroundColor: colors.primary + '15' }]}>
                    {item.icon === 'map' && <MapPinIcon color={colors.primary} />}
                    {item.icon === 'mail' && <MailIcon color={colors.primary} />}
                    {item.icon === 'phone' && <PhoneIcon color={colors.primary} />}
                  </View>
                  <Text style={[styles.contactLabel, { color: colors.text }]}>{item.label}</Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── Dark Mode Toggle ── */}
        <View style={[styles.section, { paddingHorizontal: 24 }]}>
          <View style={[styles.themeRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.themeRowLeft}>
              <View style={[styles.themeIconWrap, { backgroundColor: isDark ? colors.accentLight : colors.primaryLight }]}>
                <MoonIcon color={isDark ? colors.accent : colors.primary} size={18} />
              </View>
              <View>
                <Text style={[styles.themeLabel, { color: colors.text }]}>Dark Mode</Text>
                <Text style={[styles.themeSub, { color: colors.textMuted }]}>{isDark ? 'Currently dark theme' : 'Currently light theme'}</Text>
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
          <Text style={[styles.footerText, { color: colors.textMuted }]}>WeThink.ae © 2019–2026</Text>
          <Text style={[styles.footerSub, { color: colors.textMuted }]}>The Middle East's Leading AI Consultancy</Text>
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
  sectionTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5, marginBottom: 14 },

  // Hero
  hero: {
    height: 200 + (Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 24),
    paddingTop: Platform.OS === 'ios' ? 56 : (StatusBar.currentHeight ?? 24) + 12,
    alignItems: 'center',
    overflow: 'hidden',
    paddingBottom: 28,
    justifyContent: 'flex-end',
  },
  heroCircle: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.06)' },
  heroCircle1: { width: 240, height: 240, top: -100, right: -60 },
  heroCircle2: { width: 150, height: 150, bottom: -40, left: -30 },
  logoCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  logoText: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: -1 },
  heroCompanyName: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -0.8, marginBottom: 6 },
  heroTagline: { color: 'rgba(255,255,255,0.75)', fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },
  foundedBadge: { marginTop: 12, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 },
  foundedText: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '700' },

  // Stats bar
  statsBar: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 20,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 18 },
  statValue: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  statLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  statDivider: { width: 1, marginVertical: 12 },

  // Mission
  missionCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  missionText: { fontSize: 15, lineHeight: 23, fontStyle: 'italic', fontWeight: '500' },

  // Leadership
  leadershipRow: { paddingHorizontal: 24, paddingBottom: 4, gap: 12 },
  leaderCard: {
    width: 160,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  leaderAvatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  leaderInitials: { color: '#fff', fontSize: 22, fontWeight: '800' },
  leaderName: { fontSize: 14, fontWeight: '800', textAlign: 'center', letterSpacing: -0.2, marginBottom: 3 },
  leaderRole: { fontSize: 12, textAlign: 'center', marginBottom: 10 },
  credentialTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  credentialText: { fontSize: 10, fontWeight: '700', textAlign: 'center', lineHeight: 14 },

  // Clients
  clientGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  clientChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  clientDot: { width: 7, height: 7, borderRadius: 3.5 },
  clientName: { fontSize: 13, fontWeight: '700' },

  // Certifications
  certRow: { paddingBottom: 4, gap: 12 },
  certCard: {
    width: 150,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  certIconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  certName: { fontSize: 13, fontWeight: '800', textAlign: 'center', letterSpacing: -0.2, marginBottom: 3 },
  certSub: { fontSize: 11, textAlign: 'center', fontWeight: '500' },

  // Contact
  contactCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 14 },
  contactIconWrap: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  contactLabel: { fontSize: 14, fontWeight: '600' },
  contactDivider: { height: 1, marginLeft: 68 },

  // Theme toggle
  themeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 18, borderWidth: 1, padding: 16 },
  themeRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  themeIconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  themeLabel: { fontSize: 15, fontWeight: '700' },
  themeSub: { fontSize: 12, marginTop: 1 },

  // Footer
  footer: { alignItems: 'center', marginTop: 32, gap: 4 },
  footerText: { fontSize: 13, fontWeight: '600' },
  footerSub: { fontSize: 11 },
});
