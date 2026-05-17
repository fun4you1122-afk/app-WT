import React, { useRef, useEffect } from 'react';
import {
  Animated, Easing, ScrollView, StyleSheet, View, Text,
  TouchableOpacity, Dimensions, Platform, StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Circle, Defs, RadialGradient, Stop, Ellipse, G } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import {
  BotIcon, QuizIcon, CostIcon, ROIIcon, CalendarIcon, NewsIcon,
  BookIcon, KeyIcon, GaugeIcon, ShieldIcon, BoardIcon, HeadsetIcon,
} from '../../components/ToolIcons';

const { width: W } = Dimensions.get('window');
const CARD_W = (W - 48 - 12) / 2;

const PRIMARY_TOOLS = [
  {
    id: 'ai-chat',
    Icon: BotIcon,
    title: 'AI Assistant',
    subtitle: 'Chat with WeThink AI',
    colors: ['#5B21B6', '#7C3AED', '#A78BFA'] as const,
    accent: '#C4B5FD',
    stat: '24/7',
    statLabel: 'Available',
  },
  {
    id: 'quiz',
    Icon: QuizIcon,
    title: 'Readiness Quiz',
    subtitle: 'Assess digital maturity',
    colors: ['#1D4ED8', '#2563EB', '#38BDF8'] as const,
    accent: '#93C5FD',
    stat: '5 min',
    statLabel: 'Assessment',
  },
  {
    id: 'cost-estimator',
    Icon: CostIcon,
    title: 'Cost Estimator',
    subtitle: 'Price your project',
    colors: ['#065F46', '#059669', '#34D399'] as const,
    accent: '#6EE7B7',
    stat: 'Live',
    statLabel: 'Pricing',
  },
  {
    id: 'roi-calculator',
    Icon: ROIIcon,
    title: 'ROI Calculator',
    subtitle: 'Measure your returns',
    colors: ['#92400E', '#D97706', '#FCD34D'] as const,
    accent: '#FDE68A',
    stat: '3x',
    statLabel: 'Avg Return',
  },
  {
    id: 'consultation',
    Icon: CalendarIcon,
    title: 'Book a Call',
    subtitle: 'Free 30-min consultation',
    colors: ['#991B1B', '#DC2626', '#F87171'] as const,
    accent: '#FCA5A5',
    stat: 'Free',
    statLabel: '30 Min',
  },
  {
    id: 'news',
    Icon: NewsIcon,
    title: 'Tech News',
    subtitle: 'Latest AI stories',
    colors: ['#0C4A6E', '#0EA5E9', '#7DD3FC'] as const,
    accent: '#BAE6FD',
    stat: 'Live',
    statLabel: 'Feed',
  },
];

const SECONDARY_TOOLS = [
  { id: 'knowledge-base',  Icon: BookIcon,    title: 'Knowledge Base', color: '#7C3AED', bg: '#EDE9FE' },
  { id: 'password-gen',    Icon: KeyIcon,     title: 'Password Gen',   color: '#059669', bg: '#D1FAE5' },
  { id: 'speed-test',      Icon: GaugeIcon,   title: 'Speed Test',     color: '#D97706', bg: '#FEF3C7' },
  { id: 'security-scan',   Icon: ShieldIcon,  title: 'Security Scan',  color: '#DC2626', bg: '#FEE2E2' },
  { id: 'project-tracker', Icon: BoardIcon,   title: 'Projects',       color: '#0055FF', bg: '#DBEAFE' },
  { id: 'live-chat',       Icon: HeadsetIcon, title: 'Live Support',   color: '#0EA5E9', bg: '#E0F2FE' },
];

// ── Decorative SVG blob ───────────────────────────────────────────────────────
function HeroDecor() {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 4000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      Animated.timing(anim, { toValue: 0, duration: 4000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
    ])).start();
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, {
      opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0.9] }),
      transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }],
    }]} pointerEvents="none">
      <Svg width={W} height={180} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="rg1" cx="70%" cy="30%" r="50%">
            <Stop offset="0%" stopColor="#A78BFA" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="rg2" cx="20%" cy="80%" r="40%">
            <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Ellipse cx={W * 0.75} cy={50} rx={90} ry={90} fill="url(#rg1)" />
        <Ellipse cx={W * 0.2} cy={140} rx={70} ry={70} fill="url(#rg2)" />
        <Circle cx={W * 0.85} cy={150} r={18} fill="rgba(255,255,255,0.07)" />
        <Circle cx={W * 0.1} cy={40} r={12} fill="rgba(255,255,255,0.09)" />
        <Circle cx={W * 0.5} cy={160} r={8} fill="rgba(255,255,255,0.06)" />
      </Svg>
    </Animated.View>
  );
}

// ── Card decorative ring ──────────────────────────────────────────────────────
function CardDecorRing({ color }: { color: string }) {
  return (
    <Svg width={80} height={80} style={[StyleSheet.absoluteFill, { top: -10, right: -10, opacity: 0.18 }]} pointerEvents="none">
      <Circle cx={70} cy={10} r={50} stroke={color} strokeWidth="1" fill="none" />
      <Circle cx={70} cy={10} r={30} stroke={color} strokeWidth="1" fill="none" />
    </Svg>
  );
}

// ── Primary grid card ─────────────────────────────────────────────────────────
function PrimaryCard({ tool, index }: { tool: typeof PRIMARY_TOOLS[0]; index: number }) {
  const scale   = useRef(new Animated.Value(0.82)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        delay: index * 80,
        useNativeDriver: true,
        damping: 14,
        stiffness: 120,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(pressScale, { toValue: 0.95, useNativeDriver: true, damping: 15, stiffness: 300 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 250 }).start();
  };
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(('/tools/' + tool.id) as any);
  };

  return (
    <Animated.View style={{ opacity, transform: [{ scale: Animated.multiply(scale, pressScale) }], width: CARD_W }}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.cardOuter}
      >
        <LinearGradient colors={tool.colors} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <CardDecorRing color={tool.accent} />

          {/* Icon container */}
          <View style={styles.iconWrap}>
            <tool.Icon color="#fff" size={26} />
          </View>

          {/* Stat badge */}
          <View style={[styles.statBadge, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <Text style={styles.statNum}>{tool.stat}</Text>
            <Text style={styles.statLbl}>{tool.statLabel}</Text>
          </View>

          {/* Labels */}
          <View style={styles.cardBottom}>
            <Text style={styles.cardTitle} numberOfLines={1}>{tool.title}</Text>
            <Text style={styles.cardSubtitle} numberOfLines={2}>{tool.subtitle}</Text>
          </View>

          {/* Arrow */}
          <View style={styles.arrowBubble}>
            <Text style={styles.arrowText}>↗</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Secondary row item ────────────────────────────────────────────────────────
function SecondaryItem({ tool, index }: { tool: typeof SECONDARY_TOOLS[0]; index: number }) {
  const translateX = useRef(new Animated.Value(30)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, { toValue: 0, delay: 300 + index * 60, useNativeDriver: true, damping: 16, stiffness: 140 }),
      Animated.timing(opacity, { toValue: 1, duration: 300, delay: 300 + index * 60, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateX }] }}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push(('/tools/' + tool.id) as any);
        }}
        activeOpacity={0.82}
        style={[styles.secItem, { borderColor: tool.color + '30' }]}
      >
        <View style={[styles.secIconWrap, { backgroundColor: tool.bg }]}>
          <tool.Icon color={tool.color} size={20} />
        </View>
        <Text style={[styles.secTitle, { color: tool.color }]} numberOfLines={1}>{tool.title}</Text>
        <Text style={{ color: tool.color, fontSize: 14, marginLeft: 'auto' }}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ServicesScreen() {
  const { colors, isDark } = useTheme();
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Hero ── */}
        <Animated.View style={{
          opacity: headerAnim,
          transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }) }],
        }}>
          <LinearGradient
            colors={['#1E0A4C', '#0055FF', '#0EA5E9']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <HeroDecor />
            <View style={styles.heroInner}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>12 AI-Powered Tools</Text>
              </View>
              <Text style={styles.heroH1}>WeThink</Text>
              <Text style={styles.heroH2}>Tool Suite</Text>
              <Text style={styles.heroSub}>Enterprise intelligence at your fingertips</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── Section: Featured ── */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured</Text>
            <Text style={[styles.sectionSub, { color: colors.textMuted }]}>Most used tools</Text>
          </View>
          <View style={[styles.countBadge, { backgroundColor: colors.primary + '18' }]}>
            <Text style={[styles.countText, { color: colors.primary }]}>6</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {PRIMARY_TOOLS.map((tool, i) => (
            <PrimaryCard key={tool.id} tool={tool} index={i} />
          ))}
        </View>

        {/* ── Section: More Tools ── */}
        <View style={[styles.sectionHeader, { marginTop: 28 }]}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>More Tools</Text>
            <Text style={[styles.sectionSub, { color: colors.textMuted }]}>Utilities & support</Text>
          </View>
          <View style={[styles.countBadge, { backgroundColor: colors.primary + '18' }]}>
            <Text style={[styles.countText, { color: colors.primary }]}>6</Text>
          </View>
        </View>

        <View style={[styles.secList, { backgroundColor: colors.surface }]}>
          {SECONDARY_TOOLS.map((tool, i) => (
            <React.Fragment key={tool.id}>
              <SecondaryItem tool={tool} index={i} />
              {i < SECONDARY_TOOLS.length - 1 && (
                <View style={[styles.sep, { backgroundColor: colors.borderLight }]} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* ── Footer note ── */}
        <Text style={[styles.footer, { color: colors.textMuted }]}>
          All tools powered by WeThink AI Platform
        </Text>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: 24 },

  // Hero
  hero: {
    height: 220,
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight ?? 24) + 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  heroInner: { paddingHorizontal: 24, paddingBottom: 24, zIndex: 1 },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 10,
  },
  heroBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  heroH1: { color: '#fff', fontSize: 38, fontWeight: '900', letterSpacing: -1, lineHeight: 40 },
  heroH2: { color: 'rgba(255,255,255,0.85)', fontSize: 38, fontWeight: '900', letterSpacing: -1, lineHeight: 42 },
  heroSub: { color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 6, fontWeight: '500' },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 28,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  sectionSub: { fontSize: 12, fontWeight: '500', marginTop: 1 },
  countBadge: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  countText: { fontSize: 14, fontWeight: '800' },

  // Primary grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 24 },
  cardOuter: {
    width: CARD_W,
    height: 176,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  card: { flex: 1, padding: 16, overflow: 'hidden' },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  statNum: { color: '#fff', fontSize: 13, fontWeight: '900', lineHeight: 15 },
  statLbl: { color: 'rgba(255,255,255,0.75)', fontSize: 9, fontWeight: '600', letterSpacing: 0.2 },
  cardBottom: { position: 'absolute', bottom: 14, left: 16, right: 44 },
  cardTitle: { color: '#fff', fontSize: 14, fontWeight: '800', letterSpacing: -0.2 },
  cardSubtitle: { color: 'rgba(255,255,255,0.78)', fontSize: 11, marginTop: 2, lineHeight: 15 },
  arrowBubble: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: { color: '#fff', fontSize: 13, fontWeight: '800' },

  // Secondary list
  secList: {
    marginHorizontal: 24,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  secItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderLeftWidth: 3,
  },
  secIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secTitle: { fontSize: 14, fontWeight: '700' },
  sep: { height: 1, marginLeft: 68 },

  // Footer
  footer: { fontSize: 12, textAlign: 'center', marginTop: 24 },
});
