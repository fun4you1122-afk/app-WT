import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Animated, ScrollView, StyleSheet, View, Text,
  TouchableOpacity, Dimensions, Platform, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Ellipse, Path, Rect, G } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';

const { width: W } = Dimensions.get('window');

// ─── Data ─────────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  { name: 'Banking & Finance', count: '12 projects', color: '#0055FF', gradient: ['#0D1B4B', '#0055FF'] as const, iconType: 'bank' },
  { name: 'Government & Smart City', count: '18 projects', color: '#7C3AED', gradient: ['#2E1B5E', '#7C3AED'] as const, iconType: 'gov' },
  { name: 'Energy & Utilities', count: '9 projects', color: '#059669', gradient: ['#064E3B', '#059669'] as const, iconType: 'energy' },
  { name: 'Telecom & Media', count: '14 projects', color: '#D97706', gradient: ['#451A03', '#D97706'] as const, iconType: 'telecom' },
];

const STATS = [
  { value: '247', label: 'Projects', color: '#0055FF' },
  { value: '180+', label: 'Clients', color: '#7C3AED' },
  { value: 'AED 4.2B', label: 'Value', color: '#059669' },
  { value: '99.9%', label: 'Uptime', color: '#D97706' },
];

const WHY_ITEMS = [
  { title: 'UAE-Native AI', desc: 'Built for Gulf regulations & Arabic NLP', iconType: 'flag' },
  { title: 'Enterprise Grade', desc: 'ISO 27001 certified, 99.9% SLA', iconType: 'shield' },
  { title: 'Full-Stack Team', desc: '200+ engineers, data scientists & consultants', iconType: 'team' },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function GearIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        stroke={color} strokeWidth="1.8" fill="none"
      />
      <Path
        d="M19.4 15C19.1 15.6 19.3 16.4 19.8 16.9L19.9 17C20.3 17.4 20.3 18 19.9 18.4L18.4 19.9C18 20.3 17.4 20.3 17 19.9L16.9 19.8C16.4 19.3 15.6 19.1 15 19.4C14.4 19.7 14 20.3 14 21V21.1C14 21.6 13.6 22 13.1 22H10.9C10.4 22 10 21.6 10 21.1V21C10 20.3 9.6 19.7 9 19.4C8.4 19.1 7.6 19.3 7.1 19.8L7 19.9C6.6 20.3 6 20.3 5.6 19.9L4.1 18.4C3.7 18 3.7 17.4 4.1 17L4.2 16.9C4.7 16.4 4.9 15.6 4.6 15C4.3 14.4 3.7 14 3 14H2.9C2.4 14 2 13.6 2 13.1V10.9C2 10.4 2.4 10 2.9 10H3C3.7 10 4.3 9.6 4.6 9C4.9 8.4 4.7 7.6 4.2 7.1L4.1 7C3.7 6.6 3.7 6 4.1 5.6L5.6 4.1C6 3.7 6.6 3.7 7 4.1L7.1 4.2C7.6 4.7 8.4 4.9 9 4.6C9.6 4.3 10 3.7 10 3V2.9C10 2.4 10.4 2 10.9 2H13.1C13.6 2 14 2.4 14 2.9V3C14 3.7 14.4 4.3 15 4.6C15.6 4.9 16.4 4.7 16.9 4.2L17 4.1C17.4 3.7 18 3.7 18.4 4.1L19.9 5.6C20.3 6 20.3 6.6 19.9 7L19.8 7.1C19.3 7.6 19.1 8.4 19.4 9C19.7 9.6 20.3 10 21 10H21.1C21.6 10 22 10.4 22 10.9V13.1C22 13.6 21.6 14 21.1 14H21C20.3 14 19.7 14.4 19.4 15Z"
        stroke={color} strokeWidth="1.8" fill="none"
      />
    </Svg>
  );
}

function BankIcon({ color }: { color: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path d="M3 21H21M3 10H21M5 6L12 3L19 6M4 10V21M20 10V21M8 10V21M12 10V21M16 10V21" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function GovIcon({ color }: { color: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L2 7H22L12 2Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <Path d="M2 7V9H22V7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M4 9V19M8 9V19M12 9V19M16 9V19M20 9V19" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M2 19H22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function EnergyIcon({ color }: { color: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TelecomIcon({ color }: { color: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path d="M1.5 8.5C4 5 7.5 3 12 3C16.5 3 20 5 22.5 8.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M5 12C6.7 10 9.2 9 12 9C14.8 9 17.3 10 19 12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M8.5 15.5C9.5 14.2 10.7 13.5 12 13.5C13.3 13.5 14.5 14.2 15.5 15.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Circle cx="12" cy="19" r="1.5" fill={color} />
    </Svg>
  );
}

function FlagIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M4 15S5 14 8 14S13 16 16 16S20 15 20 15V3S19 4 16 4S11 2 8 2S4 3 4 3V22" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ShieldIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22S4 18 4 12V5L12 2L20 5V12C20 18 12 22 12 22Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 12L11 14L15 10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TeamIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="8" r="3" stroke={color} strokeWidth="1.8" />
      <Path d="M3 20C3 17.24 5.69 15 9 15C12.31 15 15 17.24 15 20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M16 11C17.66 11 19 9.66 19 8C19 6.34 17.66 5 16 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M21 20C21 17.94 19.24 16.26 17 15.73" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

function getIndustryIcon(iconType: string, color: string) {
  switch (iconType) {
    case 'bank': return <BankIcon color={color} />;
    case 'gov': return <GovIcon color={color} />;
    case 'energy': return <EnergyIcon color={color} />;
    case 'telecom': return <TelecomIcon color={color} />;
    default: return null;
  }
}

function getWhyIcon(iconType: string, color: string) {
  switch (iconType) {
    case 'flag': return <FlagIcon color={color} />;
    case 'shield': return <ShieldIcon color={color} />;
    case 'team': return <TeamIcon color={color} />;
    default: return null;
  }
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const orb1Scale = useRef(new Animated.Value(1)).current;
  const orb2Scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(orb1Scale, { toValue: 1.15, duration: 2800, useNativeDriver: true }),
        Animated.timing(orb1Scale, { toValue: 1, duration: 2800, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(orb2Scale, { toValue: 1.1, duration: 3400, useNativeDriver: true }),
        Animated.timing(orb2Scale, { toValue: 1, duration: 3400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const ctaPress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(route as any);
  };

  return (
    <LinearGradient
      colors={['#020818', '#0D1B4B', '#0055FF']}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={styles.hero}
    >
      {/* Animated orbs */}
      <Animated.View style={[styles.orb, styles.orb1, { transform: [{ scale: orb1Scale }] }]} />
      <Animated.View style={[styles.orb, styles.orb2, { transform: [{ scale: orb2Scale }] }]} />
      <Svg style={StyleSheet.absoluteFill} width={W} height={280} pointerEvents="none">
        <Ellipse cx={W * 0.85} cy={50} rx={90} ry={90} fill="rgba(124,58,237,0.2)" />
        <Ellipse cx={W * 0.1} cy={220} rx={70} ry={70} fill="rgba(14,165,233,0.13)" />
        <Circle cx={W * 0.5} cy={280} r={120} stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
        <Circle cx={W * 0.5} cy={280} r={80} stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
      </Svg>

      {/* Top bar */}
      <View style={styles.heroTopBar}>
        <Text style={styles.heroLogo}>WeThink</Text>
        <TouchableOpacity
          style={styles.heroGearBtn}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/settings' as any); }}
        >
          <GearIcon color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      {/* Headline */}
      <Text style={styles.heroHeadline}>{"Transform Your\nBusiness with AI"}</Text>
      <Text style={styles.heroSub}>Enterprise AI consulting trusted by UAE's leading organizations</Text>

      {/* CTA buttons */}
      <View style={styles.heroCtas}>
        <TouchableOpacity
          style={styles.ctaSolid}
          onPress={() => ctaPress('/tools/consultation')}
          activeOpacity={0.88}
        >
          <Text style={styles.ctaSolidText}>Book Free Consultation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.ctaOutline}
          onPress={() => ctaPress('/(tabs)/services')}
          activeOpacity={0.88}
        >
          <Text style={styles.ctaOutlineText}>Explore Solutions</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

// ─── Impact Strip ─────────────────────────────────────────────────────────────
function ImpactStrip({ colors }: { colors: any }) {
  return (
    <View style={[styles.impactWrap, { backgroundColor: colors.surface }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.impactRow}>
        {STATS.map(s => (
          <View key={s.label} style={styles.impactChip}>
            <Text style={[styles.impactValue, { color: s.color }]}>{s.value}</Text>
            <Text style={[styles.impactLabel, { color: colors.textMuted }]}>{s.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Industry Card ────────────────────────────────────────────────────────────
function IndustryCard({ item, index }: { item: typeof INDUSTRIES[0]; index: number }) {
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, delay: index * 80, useNativeDriver: true, damping: 13, stiffness: 120 }),
      Animated.timing(opacity, { toValue: 1, duration: 300, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const onPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Animated.View style={{ opacity, transform: [{ scale }], width: (W - 60) / 2 }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.88}>
        <LinearGradient colors={item.gradient} style={styles.industryCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Svg style={StyleSheet.absoluteFill} width={(W - 60) / 2} height={110} pointerEvents="none">
            <Circle cx={(W - 60) / 2} cy={0} r={60} stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="none" />
          </Svg>
          <View style={styles.industryIcon}>
            {getIndustryIcon(item.iconType, 'rgba(255,255,255,0.9)')}
          </View>
          <Text style={styles.industryName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.industryCount}>{item.count}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Success Story ────────────────────────────────────────────────────────────
function SuccessStory({ colors }: { colors: any }) {
  const scale = useRef(new Animated.Value(0.96)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, delay: 200, useNativeDriver: true, damping: 14, stiffness: 110 }),
      Animated.timing(opacity, { toValue: 1, duration: 400, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#065F46', '#059669', '#34D399']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.storyCard}
        >
          <Svg style={StyleSheet.absoluteFill} width={W - 48} height={160} pointerEvents="none">
            <Circle cx={W - 80} cy={-20} r={100} stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="none" />
            <Circle cx={W - 80} cy={-20} r={60} stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
          </Svg>
          <View style={styles.storyBadge}>
            <Text style={styles.storyBadgeText}>Case Study</Text>
          </View>
          <Text style={styles.storyClient}>Emirates NBD</Text>
          <Text style={styles.storyHeadline}>AI Fraud Detection saved{'\n'}AED 340M in 12 months</Text>
          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
          <View style={styles.storyFooter}>
            <Text style={styles.storyCompletedText}>100% Complete</Text>
            <Text style={styles.storyLink}>View Story →</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Why WeThink ──────────────────────────────────────────────────────────────
function WhyWeThink({ colors }: { colors: any }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.whyRow}>
      {WHY_ITEMS.map((item, i) => (
        <View key={i} style={[styles.whyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.whyIconWrap}>
            {getWhyIcon(item.iconType, colors.primary)}
          </View>
          <Text style={[styles.whyTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.whyDesc, { color: colors.textMuted }]}>{item.desc}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <LinearGradient
      colors={['#1E0A4C', '#7C3AED']}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={styles.ctaBanner}
    >
      <Svg style={StyleSheet.absoluteFill} width={W - 48} height={140} pointerEvents="none">
        <Circle cx={W - 60} cy={70} r={80} fill="rgba(255,255,255,0.04)" />
        <Circle cx={20} cy={20} r={50} fill="rgba(255,255,255,0.03)" />
      </Svg>
      <Text style={styles.ctaBannerTitle}>Ready to transform?</Text>
      <Text style={styles.ctaBannerSub}>Join 180+ organizations powered by WeThink AI</Text>
      <TouchableOpacity
        style={styles.ctaBannerBtn}
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/(tabs)/chat' as any); }}
        activeOpacity={0.88}
      >
        <Text style={styles.ctaBannerBtnText}>Schedule a Call</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, colors }: { title: string; colors: any }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Hero ── */}
        <HeroSection />

        {/* ── Impact Numbers ── */}
        <View style={styles.section}>
          <ImpactStrip colors={colors} />
        </View>

        {/* ── Industries ── */}
        <View style={styles.section}>
          <SectionHeader title="Industries We Serve" colors={colors} />
          <View style={styles.industryGrid}>
            {INDUSTRIES.map((item, i) => (
              <IndustryCard key={item.name} item={item} index={i} />
            ))}
          </View>
        </View>

        {/* ── Success Story ── */}
        <View style={styles.section}>
          <SectionHeader title="Success Story" colors={colors} />
          <View style={styles.padH}>
            <SuccessStory colors={colors} />
          </View>
        </View>

        {/* ── Why WeThink ── */}
        <View style={styles.section}>
          <SectionHeader title="Why WeThink" colors={colors} />
          <WhyWeThink colors={colors} />
        </View>

        {/* ── CTA Banner ── */}
        <View style={[styles.section, styles.padH]}>
          <CTABanner />
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: 24 },
  section: { marginTop: 28 },
  padH: { paddingHorizontal: 24 },
  sectionHeader: { paddingHorizontal: 24, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },

  // Hero
  hero: {
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: 32,
    paddingHorizontal: 24,
    minHeight: 280,
    overflow: 'hidden',
  },
  orb: { position: 'absolute', borderRadius: 999 },
  orb1: { width: 220, height: 220, top: -80, right: -60, backgroundColor: 'rgba(124,58,237,0.2)' },
  orb2: { width: 160, height: 160, bottom: -30, left: -50, backgroundColor: 'rgba(14,165,233,0.14)' },
  heroTopBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  heroLogo: { fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  heroGearBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  heroHeadline: { fontSize: 36, fontWeight: '900', color: '#fff', letterSpacing: -1, lineHeight: 42, marginBottom: 10 },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 20, marginBottom: 24 },
  heroCtas: { flexDirection: 'row', gap: 12 },
  ctaSolid: { flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  ctaSolidText: { fontSize: 13, fontWeight: '800', color: '#0055FF' },
  ctaOutline: { flex: 1, borderRadius: 12, paddingVertical: 13, alignItems: 'center', borderWidth: 1.5, borderColor: '#fff' },
  ctaOutlineText: { fontSize: 13, fontWeight: '800', color: '#fff' },

  // Impact strip
  impactWrap: { marginHorizontal: 24, borderRadius: 18, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  impactRow: { paddingHorizontal: 8, paddingVertical: 4 },
  impactChip: { paddingHorizontal: 20, paddingVertical: 16, alignItems: 'center', minWidth: 90 },
  impactValue: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  impactLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },

  // Industry grid
  industryGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 24, gap: 12 },
  industryCard: { height: 110, borderRadius: 18, padding: 14, overflow: 'hidden', justifyContent: 'flex-end', gap: 4 },
  industryIcon: { position: 'absolute', top: 14, left: 14, opacity: 0.9 },
  industryName: { fontSize: 13, fontWeight: '800', color: '#fff', lineHeight: 17, letterSpacing: -0.2 },
  industryCount: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.65)' },

  // Success story
  storyCard: { borderRadius: 20, padding: 22, height: 160, overflow: 'hidden', justifyContent: 'flex-end', gap: 6 },
  storyBadge: { position: 'absolute', top: 18, left: 22, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  storyBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },
  storyClient: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.75)' },
  storyHeadline: { fontSize: 16, fontWeight: '900', color: '#fff', letterSpacing: -0.3, lineHeight: 21 },
  progressTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { width: '100%', height: '100%', backgroundColor: '#fff', borderRadius: 2 },
  storyFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  storyCompletedText: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600' },
  storyLink: { color: '#fff', fontSize: 13, fontWeight: '800' },

  // Why WeThink
  whyRow: { paddingHorizontal: 24, gap: 12 },
  whyCard: { width: 180, borderRadius: 18, borderWidth: 1, padding: 18, gap: 8 },
  whyIconWrap: { marginBottom: 4 },
  whyTitle: { fontSize: 14, fontWeight: '800', letterSpacing: -0.2 },
  whyDesc: { fontSize: 12, lineHeight: 16, fontWeight: '500' },

  // CTA Banner
  ctaBanner: { borderRadius: 22, padding: 28, alignItems: 'center', overflow: 'hidden', gap: 8 },
  ctaBannerTitle: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  ctaBannerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 18 },
  ctaBannerBtn: { marginTop: 12, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 32, paddingVertical: 13 },
  ctaBannerBtnText: { color: '#7C3AED', fontSize: 15, fontWeight: '800' },
});
