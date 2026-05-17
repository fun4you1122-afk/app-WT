import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Animated, Easing, ScrollView, StyleSheet, View, Text,
  TouchableOpacity, Dimensions, Platform, RefreshControl,
  NativeScrollEvent, NativeSyntheticEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, {
  Circle, Path, Polyline, Defs, LinearGradient as SvgGradient,
  Stop, Rect, G, Ellipse,
} from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { BellIcon, BotIcon, CalendarIcon, ServicesGridIcon, AnalyticsLineIcon } from '../../components/DashIcons';

const { width: W } = Dimensions.get('window');

// ─── Data ─────────────────────────────────────────────────────────────────────

const HOUR = new Date().getHours();
const GREETING =
  HOUR < 5  ? 'Good night' :
  HOUR < 12 ? 'Good morning' :
  HOUR < 17 ? 'Good afternoon' : 'Good evening';

const AI_INSIGHTS = [
  { tag: 'Market Pulse', text: 'UAE AI market projected to hit $6.4B by 2026 — 3× faster than global average.', color: '#0055FF' },
  { tag: 'Your Portfolio', text: 'Emirates NBD deployment saved 2,400 analyst hours this quarter.', color: '#7C3AED' },
  { tag: 'Opportunity', text: 'ADNOC tender opens in 14 days. Your predictive maintenance proposal is due.', color: '#059669' },
  { tag: 'Industry Trend', text: 'Generative AI adoption in Gulf banking rose 38% since last quarter.', color: '#D97706' },
];

const STORY_CARDS = [
  { icon: '📈', label: 'Revenue', value: 'AED 4.2B', delta: '+18%', deltaUp: true, sub: 'this month', color: '#0055FF', bg: ['#0055FF', '#3B82F6'] as const },
  { icon: '🏗', label: 'Projects', value: '3 need review', delta: '247 total', deltaUp: null, sub: 'active now', color: '#7C3AED', bg: ['#7C3AED', '#A78BFA'] as const },
  { icon: '🤝', label: 'Next Meeting', value: 'Tomorrow', delta: '10:00 AM', deltaUp: null, sub: 'ADNOC call', color: '#059669', bg: ['#059669', '#34D399'] as const },
  { icon: '⚡', label: 'AI Uptime', value: '99.9%', delta: '+0.1%', deltaUp: true, sub: 'last 30 days', color: '#D97706', bg: ['#D97706', '#FCD34D'] as const },
  { icon: '👥', label: 'Clients', value: '180', delta: '+12', deltaUp: true, sub: 'this quarter', color: '#DC2626', bg: ['#DC2626', '#F87171'] as const },
];

const TOOL_PREVIEWS = [
  {
    id: 'ai-chat',
    title: 'AI Assistant',
    desc: 'Ask WeThink AI anything about your business',
    stat: '2.4k',
    statLabel: 'queries today',
    colors: ['#1E0A4C', '#7C3AED', '#A78BFA'] as const,
    Icon: BotIcon,
  },
  {
    id: 'roi-calculator',
    title: 'ROI Calculator',
    desc: 'See your investment return in real-time',
    stat: '3.2×',
    statLabel: 'avg return',
    colors: ['#064E3B', '#059669', '#34D399'] as const,
    Icon: AnalyticsLineIcon,
  },
  {
    id: 'consultation',
    title: 'Book a Call',
    desc: 'Free 30-min strategy consultation',
    stat: '3 slots',
    statLabel: 'this week',
    colors: ['#0C4A6E', '#0EA5E9', '#38BDF8'] as const,
    Icon: CalendarIcon,
  },
];

const FEED_ITEMS = [
  {
    id: '1', type: 'milestone',
    avatar: 'EN', avatarColor: '#0055FF',
    name: 'Emirates NBD', time: '2h ago',
    headline: 'AI Fraud Detection deployment completed ahead of schedule',
    tag: 'Milestone', tagColor: '#059669',
    metric: '100%', metricLabel: 'complete',
  },
  {
    id: '2', type: 'news',
    avatar: 'AI', avatarColor: '#7C3AED',
    name: 'AI Pulse', time: '4h ago',
    headline: 'UAE Central Bank issues first-ever AI governance framework for financial institutions',
    tag: 'Breaking', tagColor: '#DC2626',
    metric: null, metricLabel: null,
  },
  {
    id: '3', type: 'project',
    avatar: 'DM', avatarColor: '#0EA5E9',
    name: 'Dubai Municipality', time: '6h ago',
    headline: 'Smart City Dashboard hits 78% completion — Phase 2 begins next week',
    tag: 'Active', tagColor: '#0055FF',
    metric: '78%', metricLabel: 'done',
  },
  {
    id: '4', type: 'insight',
    avatar: 'WT', avatarColor: '#D97706',
    name: 'WeThink AI', time: '1d ago',
    headline: 'Your Q2 pipeline is 34% larger than Q1. 5 proposals pending client review.',
    tag: 'Insight', tagColor: '#D97706',
    metric: '+34%', metricLabel: 'pipeline',
  },
  {
    id: '5', type: 'project',
    avatar: 'AD', avatarColor: '#059669',
    name: 'ADNOC', time: '2d ago',
    headline: 'Predictive Maintenance model accuracy improved to 94.2% after retraining',
    tag: 'Update', tagColor: '#7C3AED',
    metric: '94.2%', metricLabel: 'accuracy',
  },
];

// ─── Sparkline ────────────────────────────────────────────────────────────────
const SPARK = [42, 58, 52, 71, 65, 80, 74, 92];

function MiniSparkline({ width = 80, height = 28, color = '#fff' }: { width?: number; height?: number; color?: string }) {
  const pad = 4;
  const pts = SPARK.map((v, i) => {
    const x = pad + (i / (SPARK.length - 1)) * (width - pad * 2);
    const y = height - pad - ((v / 100) * (height - pad * 2));
    return `${x},${y}`;
  });
  return (
    <Svg width={width} height={height}>
      <Defs>
        <SvgGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <Stop offset="100%" stopColor={color} stopOpacity="0" />
        </SvgGradient>
      </Defs>
      <Path
        d={`M ${pts[0]} L ${pts.slice(1).join(' L ')} L ${SPARK.length > 1 ? pts[pts.length-1].split(',')[0] : '0'},${height} L ${pts[0].split(',')[0]},${height} Z`}
        fill="url(#sg)"
      />
      <Polyline
        points={pts.join(' ')}
        stroke={color}
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({ insightIdx }: { insightIdx: number }) {
  const { colors } = useTheme();
  const insight = AI_INSIGHTS[insightIdx % AI_INSIGHTS.length];
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 1800, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(pulse, { toValue: 1, duration: 1800, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.heroWrap}>
      <LinearGradient
        colors={['#020818', '#0D1B4B', '#0055FF']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.heroBg}
      >
        {/* Decorative orbs */}
        <Animated.View style={[styles.orb, styles.orb1, { transform: [{ scale: pulse }] }]} />
        <Animated.View style={[styles.orb, styles.orb2]} />
        <Svg style={StyleSheet.absoluteFill} width={W} height={260} pointerEvents="none">
          <Ellipse cx={W * 0.85} cy={60} rx={80} ry={80} fill="rgba(124,58,237,0.18)" />
          <Ellipse cx={W * 0.15} cy={200} rx={60} ry={60} fill="rgba(14,165,233,0.12)" />
          <Circle cx={W * 0.5} cy={240} r={100} stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
          <Circle cx={W * 0.5} cy={240} r={70} stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
        </Svg>

        <View style={styles.heroContent}>
          {/* Top row */}
          <View style={styles.heroTop}>
            <LinearGradient colors={['#0055FF', '#7C3AED']} style={styles.heroAvatar}>
              <Text style={styles.heroAvatarText}>RA</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroGreeting}>{GREETING} 👋</Text>
              <Text style={styles.heroName}>Rasha Aljalam</Text>
            </View>
            <View style={styles.heroBadgeWrap}>
              <View style={styles.heroBadgeDot} />
              <Text style={styles.heroBadgeText}>Live</Text>
            </View>
          </View>

          {/* Revenue strip */}
          <View style={styles.revenueStrip}>
            <View style={{ flex: 1 }}>
              <Text style={styles.revenueLabel}>Total Revenue</Text>
              <Text style={styles.revenueValue}>AED 4.2B</Text>
              <View style={styles.revenueDelta}>
                <Text style={styles.revenueDeltaText}>↑ +18% this month</Text>
              </View>
            </View>
            <View style={styles.sparkWrap}>
              <MiniSparkline width={90} height={36} color="#fff" />
            </View>
          </View>

          {/* AI Insight card */}
          <View style={[styles.insightCard, { borderColor: insight.color + '50' }]}>
            <View style={[styles.insightTag, { backgroundColor: insight.color }]}>
              <Text style={styles.insightTagText}>{insight.tag}</Text>
            </View>
            <Text style={styles.insightText} numberOfLines={2}>{insight.text}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

// ─── Story Cards ─────────────────────────────────────────────────────────────
function StoryCard({ item, index }: { item: typeof STORY_CARDS[0]; index: number }) {
  const scale = useRef(new Animated.Value(0.88)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, delay: index * 70, useNativeDriver: true, damping: 13, stiffness: 130 }),
      Animated.timing(opacity, { toValue: 1, duration: 300, delay: index * 70, useNativeDriver: true }),
    ]).start();
  }, []);

  const onPressIn = () => Animated.spring(pressScale, { toValue: 0.94, useNativeDriver: true, damping: 15, stiffness: 400 }).start();
  const onPressOut = () => Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 300 }).start();

  return (
    <Animated.View style={{ opacity, transform: [{ scale: Animated.multiply(scale, pressScale) }] }}>
      <TouchableOpacity onPressIn={onPressIn} onPressOut={onPressOut} activeOpacity={1}>
        <LinearGradient colors={item.bg} style={styles.storyCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Svg style={[StyleSheet.absoluteFill, { opacity: 0.12 }]} width={140} height={120}>
            <Circle cx={120} cy={-10} r={70} stroke="#fff" strokeWidth="1" fill="none" />
            <Circle cx={120} cy={-10} r={45} stroke="#fff" strokeWidth="1" fill="none" />
          </Svg>
          <View style={styles.storyTop}>
            <Text style={styles.storyIcon}>{item.icon}</Text>
            <Text style={styles.storyLabel}>{item.label}</Text>
          </View>
          <Text style={styles.storyValue}>{item.value}</Text>
          <View style={styles.storyBottom}>
            {item.deltaUp !== null ? (
              <View style={styles.storyDeltaWrap}>
                <Text style={styles.storyDeltaArrow}>{item.deltaUp ? '↑' : '↓'}</Text>
                <Text style={styles.storyDelta}>{item.delta}</Text>
              </View>
            ) : (
              <Text style={styles.storyDeltaFlat}>{item.delta}</Text>
            )}
            <Text style={styles.storySub}>{item.sub}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Tool Carousel Card ───────────────────────────────────────────────────────
function ToolCarouselCard({ item, index }: { item: typeof TOOL_PREVIEWS[0]; index: number }) {
  const translateX = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, { toValue: 0, delay: 200 + index * 100, useNativeDriver: true, damping: 14, stiffness: 120 }),
      Animated.timing(opacity, { toValue: 1, duration: 350, delay: 200 + index * 100, useNativeDriver: true }),
    ]).start();
  }, []);

  const onPressIn = () => Animated.spring(pressScale, { toValue: 0.95, useNativeDriver: true, damping: 15, stiffness: 400 }).start();
  const onPressOut = () => Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 300 }).start();

  return (
    <Animated.View style={{ opacity, transform: [{ translateX }, { scale: pressScale }] }}>
      <TouchableOpacity
        onPressIn={onPressIn} onPressOut={onPressOut} activeOpacity={1}
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push(('/tools/' + item.id) as any); }}
      >
        <LinearGradient colors={item.colors} style={styles.toolCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Svg style={StyleSheet.absoluteFill} width={220} height={140} pointerEvents="none">
            <Circle cx={180} cy={-20} r={90} stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
            <Circle cx={180} cy={-20} r={60} stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
          </Svg>
          <View style={styles.toolIconWrap}>
            <item.Icon color="#fff" size={22} />
          </View>
          <View style={styles.toolStatBubble}>
            <Text style={styles.toolStatNum}>{item.stat}</Text>
            <Text style={styles.toolStatLbl}>{item.statLabel}</Text>
          </View>
          <Text style={styles.toolTitle}>{item.title}</Text>
          <Text style={styles.toolDesc} numberOfLines={2}>{item.desc}</Text>
          <View style={styles.toolCta}>
            <Text style={styles.toolCtaText}>Open →</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Feed Item ────────────────────────────────────────────────────────────────
function FeedItem({ item, index, colors }: { item: typeof FEED_ITEMS[0]; index: number; colors: any }) {
  const slideY = useRef(new Animated.Value(24)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [liked, setLiked] = useState(false);
  const likeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideY, { toValue: 0, delay: index * 80, useNativeDriver: true, damping: 16, stiffness: 130 }),
      Animated.timing(opacity, { toValue: 1, duration: 300, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLiked(v => !v);
    Animated.sequence([
      Animated.spring(likeScale, { toValue: 1.4, useNativeDriver: true, damping: 6, stiffness: 400 }),
      Animated.spring(likeScale, { toValue: 1, useNativeDriver: true, damping: 10, stiffness: 300 }),
    ]).start();
  };

  return (
    <Animated.View style={[styles.feedCard, { backgroundColor: colors.surface, opacity, transform: [{ translateY: slideY }] }]}>
      {/* Left accent */}
      <View style={[styles.feedAccent, { backgroundColor: item.tagColor }]} />

      <View style={styles.feedBody}>
        {/* Header */}
        <View style={styles.feedHeader}>
          <View style={[styles.feedAvatar, { backgroundColor: item.avatarColor }]}>
            <Text style={styles.feedAvatarText}>{item.avatar}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.feedName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.feedTime, { color: colors.textMuted }]}>{item.time}</Text>
          </View>
          <View style={[styles.feedTag, { backgroundColor: item.tagColor + '18' }]}>
            <Text style={[styles.feedTagText, { color: item.tagColor }]}>{item.tag}</Text>
          </View>
        </View>

        {/* Headline */}
        <Text style={[styles.feedHeadline, { color: colors.text }]}>{item.headline}</Text>

        {/* Footer */}
        <View style={styles.feedFooter}>
          {item.metric ? (
            <View style={[styles.feedMetricWrap, { backgroundColor: item.tagColor + '12' }]}>
              <Text style={[styles.feedMetric, { color: item.tagColor }]}>{item.metric}</Text>
              <Text style={[styles.feedMetricLabel, { color: colors.textMuted }]}>{item.metricLabel}</Text>
            </View>
          ) : <View />}
          <TouchableOpacity onPress={handleLike} style={styles.feedLikeBtn}>
            <Animated.View style={{ transform: [{ scale: likeScale }] }}>
              <Svg width={18} height={18} viewBox="0 0 24 24">
                <Path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  stroke={liked ? '#DC2626' : colors.textMuted}
                  strokeWidth="1.8"
                  fill={liked ? '#DC2626' : 'none'}
                  strokeLinecap="round"
                />
              </Svg>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, sub, action, onAction, colors }: {
  title: string; sub?: string; action?: string; onAction?: () => void; colors: any;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        {sub && <Text style={[styles.sectionSub, { color: colors.textMuted }]}>{sub}</Text>}
      </View>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={[styles.sectionAction, { color: colors.primary }]}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Today's Focus ────────────────────────────────────────────────────────────
function TodaysFocus({ colors }: { colors: any }) {
  const scale = useRef(new Animated.Value(0.95)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 14, stiffness: 120 }),
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/tools/consultation' as any); }}
        activeOpacity={0.9}
      >
        <LinearGradient colors={['#0C4A6E', '#0EA5E9']} style={styles.focusCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Svg style={StyleSheet.absoluteFill} width={W - 48} height={90} pointerEvents="none">
            <Circle cx={W - 80} cy={45} r={60} stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="none" />
          </Svg>
          <View style={styles.focusLeft}>
            <Text style={styles.focusLabel}>Today's Focus</Text>
            <Text style={styles.focusHeadline}>ADNOC consultation{'\n'}call confirmed</Text>
            <Text style={styles.focusTime}>Tomorrow · 10:00 AM GST</Text>
          </View>
          <View style={styles.focusRight}>
            <View style={styles.focusCta}>
              <CalendarIcon color="#fff" size={20} />
            </View>
            <Text style={styles.focusCtaLabel}>View</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [insightIdx, setInsightIdx] = useState(0);
  const insightAnim = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  // Auto-rotate insights every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      Animated.sequence([
        Animated.timing(insightAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start(() => {
        setInsightIdx(i => i + 1);
        Animated.timing(insightAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  // Header fade on scroll
  const headerBg = scrollY.interpolate({ inputRange: [0, 80], outputRange: ['rgba(10,22,40,0)', colors.surface], extrapolate: 'clamp' });
  const headerBorderOpacity = scrollY.interpolate({ inputRange: [60, 100], outputRange: [0, 1], extrapolate: 'clamp' });

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>

      {/* Floating transparent header */}
      <Animated.View style={[styles.floatHeader, { backgroundColor: headerBg }]}>
        <Animated.View style={[styles.floatHeaderBorder, { backgroundColor: colors.border, opacity: headerBorderOpacity }]} />
        <View style={styles.floatHeaderInner}>
          <Text style={[styles.floatTitle, { color: colors.text }]}>WeThink</Text>
          <TouchableOpacity
            style={[styles.bellBtn, { backgroundColor: colors.surface }]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          >
            <BellIcon color={colors.text} size={20} />
            <View style={[styles.notifDot, { borderColor: colors.background }]} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Hero ── */}
        <Animated.View style={{ opacity: insightAnim }}>
          <HeroSection insightIdx={insightIdx} />
        </Animated.View>

        {/* ── Today's Focus ── */}
        <View style={styles.section}>
          <TodaysFocus colors={colors} />
        </View>

        {/* ── Story Cards ── */}
        <View style={styles.section}>
          <SectionHeader title="Snapshot" sub="Tap to explore" colors={colors} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesRow}>
            {STORY_CARDS.map((c, i) => <StoryCard key={c.label} item={c} index={i} />)}
          </ScrollView>
        </View>

        {/* ── Featured Tools ── */}
        <View style={styles.section}>
          <SectionHeader
            title="Featured Tools"
            sub="AI-powered suite"
            action="See all"
            onAction={() => router.push('/(tabs)/services' as any)}
            colors={colors}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolsRow}>
            {TOOL_PREVIEWS.map((t, i) => <ToolCarouselCard key={t.id} item={t} index={i} />)}
          </ScrollView>
        </View>

        {/* ── Live Feed ── */}
        <View style={styles.section}>
          <SectionHeader
            title="Live Feed"
            sub="Projects, news & insights"
            action="View all"
            onAction={() => router.push('/(tabs)/community' as any)}
            colors={colors}
          />
          <View style={styles.feedList}>
            {FEED_ITEMS.map((item, i) => (
              <FeedItem key={item.id} item={item} index={i} colors={colors} />
            ))}
          </View>
        </View>

        {/* ── Quick Actions ── */}
        <View style={styles.section}>
          <SectionHeader title="Quick Access" colors={colors} />
          <View style={styles.quickRow}>
            {[
              { label: 'AI Chat',   Icon: BotIcon,          colors: ['#5B21B6','#7C3AED'] as const, route: '/(tabs)/chat' },
              { label: 'Calendar',  Icon: CalendarIcon,     colors: ['#065F46','#059669'] as const, route: '/tools/consultation' },
              { label: 'Services',  Icon: ServicesGridIcon, colors: ['#0C4A6E','#0EA5E9'] as const, route: '/(tabs)/services' },
              { label: 'Analytics', Icon: AnalyticsLineIcon,colors: ['#78350F','#D97706'] as const, route: '/(tabs)/portfolio' },
            ].map(a => (
              <TouchableOpacity
                key={a.label}
                style={styles.quickItem}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push(a.route as any); }}
                activeOpacity={0.8}
              >
                <LinearGradient colors={a.colors} style={styles.quickCircle}>
                  <a.Icon color="#fff" size={24} />
                </LinearGradient>
                <Text style={[styles.quickLabel, { color: colors.textMuted }]}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={[styles.footer, { color: colors.textMuted }]}>WeThink.ae · Built in Dubai 🇦🇪</Text>
        <View style={{ height: 40 }} />
      </Animated.ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: 24 },

  // Floating header
  floatHeader: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 100,
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingBottom: 10,
  },
  floatHeaderBorder: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 1 },
  floatHeaderInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24 },
  floatTitle: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  bellBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  notifDot: { position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: 4, backgroundColor: '#DC2626', borderWidth: 1.5 },

  // Hero
  heroWrap: { marginBottom: 0 },
  heroBg: {
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  orb: { position: 'absolute', borderRadius: 999 },
  orb1: { width: 200, height: 200, top: -60, right: -60, backgroundColor: 'rgba(124,58,237,0.22)' },
  orb2: { width: 140, height: 140, bottom: 0, left: -40, backgroundColor: 'rgba(14,165,233,0.15)' },
  heroContent: { paddingHorizontal: 24, gap: 16 },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroAvatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  heroAvatarText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  heroGreeting: { color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: '500' },
  heroName: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  heroBadgeWrap: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(5,150,105,0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  heroBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34D399' },
  heroBadgeText: { color: '#34D399', fontSize: 11, fontWeight: '700' },
  revenueStrip: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 18, padding: 16 },
  revenueLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '500' },
  revenueValue: { color: '#fff', fontSize: 34, fontWeight: '900', letterSpacing: -1, marginTop: 2 },
  revenueDelta: { marginTop: 4, alignSelf: 'flex-start', backgroundColor: 'rgba(52,211,153,0.2)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  revenueDeltaText: { color: '#34D399', fontSize: 11, fontWeight: '700' },
  sparkWrap: {},
  insightCard: { borderRadius: 14, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.06)', padding: 14, gap: 8 },
  insightTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  insightTagText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.4 },
  insightText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '500', lineHeight: 19 },

  // Section
  section: { paddingTop: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.4 },
  sectionSub: { fontSize: 12, fontWeight: '500', marginTop: 1 },
  sectionAction: { fontSize: 13, fontWeight: '700' },

  // Story cards
  storiesRow: { paddingHorizontal: 24, gap: 10 },
  storyCard: { width: 140, height: 130, borderRadius: 18, padding: 14, overflow: 'hidden', justifyContent: 'space-between' },
  storyTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  storyIcon: { fontSize: 16 },
  storyLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '600' },
  storyValue: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  storyBottom: { gap: 2 },
  storyDeltaWrap: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  storyDeltaArrow: { color: '#fff', fontSize: 11, fontWeight: '800' },
  storyDelta: { color: '#fff', fontSize: 11, fontWeight: '700' },
  storyDeltaFlat: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '700' },
  storySub: { color: 'rgba(255,255,255,0.55)', fontSize: 10, fontWeight: '500' },

  // Tool carousel
  toolsRow: { paddingHorizontal: 24, gap: 12 },
  toolCard: { width: 220, height: 148, borderRadius: 20, padding: 16, overflow: 'hidden', justifyContent: 'flex-end', gap: 4 },
  toolIconWrap: { position: 'absolute', top: 14, left: 16, width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  toolStatBubble: { position: 'absolute', top: 14, right: 14, alignItems: 'flex-end', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  toolStatNum: { color: '#fff', fontSize: 14, fontWeight: '900', lineHeight: 16 },
  toolStatLbl: { color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: '600' },
  toolTitle: { color: '#fff', fontSize: 15, fontWeight: '800', letterSpacing: -0.3 },
  toolDesc: { color: 'rgba(255,255,255,0.72)', fontSize: 11, lineHeight: 15 },
  toolCta: { marginTop: 4 },
  toolCtaText: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '700' },

  // Today's focus
  focusCard: { marginHorizontal: 24, borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  focusLeft: { flex: 1, gap: 4 },
  focusLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600', letterSpacing: 0.3 },
  focusHeadline: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: -0.3, lineHeight: 21 },
  focusTime: { color: 'rgba(255,255,255,0.65)', fontSize: 11, fontWeight: '500' },
  focusRight: { alignItems: 'center', gap: 6 },
  focusCta: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  focusCtaLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600' },

  // Feed
  feedList: { paddingHorizontal: 24, gap: 10 },
  feedCard: { borderRadius: 16, flexDirection: 'row', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  feedAccent: { width: 3 },
  feedBody: { flex: 1, padding: 14, gap: 10 },
  feedHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  feedAvatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  feedAvatarText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  feedName: { fontSize: 13, fontWeight: '700' },
  feedTime: { fontSize: 11, marginTop: 1 },
  feedTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  feedTagText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
  feedHeadline: { fontSize: 13, fontWeight: '500', lineHeight: 19 },
  feedFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  feedMetricWrap: { flexDirection: 'row', alignItems: 'baseline', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  feedMetric: { fontSize: 14, fontWeight: '900' },
  feedMetricLabel: { fontSize: 10, fontWeight: '500' },
  feedLikeBtn: { padding: 4 },

  // Quick actions
  quickRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 24 },
  quickItem: { alignItems: 'center', gap: 8 },
  quickCircle: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  quickLabel: { fontSize: 11, fontWeight: '600' },

  footer: { fontSize: 12, textAlign: 'center', marginTop: 24 },
});
