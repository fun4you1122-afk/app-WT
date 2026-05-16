import React, { useRef, useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Path, Polyline, G, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';

const { width: W } = Dimensions.get('window');

// Sparkline data points (normalized 0–100)
const SPARK = [42, 58, 52, 71, 65, 80, 74, 92];

// Metric rings
const RINGS = [
  { label: 'Projects', value: '247',   numVal: 247, maxVal: 300, color: '#0055FF' },
  { label: 'AI Models', value: '38',   numVal: 38,  maxVal: 50,  color: '#7C3AED' },
  { label: 'Clients',   value: '180',  numVal: 180, maxVal: 200, color: '#059669' },
  { label: 'Uptime',    value: '99.9%',numVal: 99,  maxVal: 100, color: '#D97706' },
];

// Donut segments
const DONUT = [
  { label: 'Active',    pct: 45, color: '#0055FF' },
  { label: 'Review',    pct: 30, color: '#7C3AED' },
  { label: 'Completed', pct: 25, color: '#059669' },
];

const QUICK_ACTIONS = [
  { label: 'Demo',      icon: '📅', colors: ['#0055FF', '#3B82F6'] as const, route: '/(tabs)/services' },
  { label: 'AI Chat',   icon: '🤖', colors: ['#7C3AED', '#A78BFA'] as const, route: '/(tabs)/chat'     },
  { label: 'Services',  icon: '⚡', colors: ['#059669', '#34D399'] as const, route: '/(tabs)/services' },
  { label: 'Analytics', icon: '📊', colors: ['#D97706', '#FCD34D'] as const, route: '/(tabs)/portfolio' },
];

const ACTIVITIES = [
  { color: '#059669', text: 'Emirates NBD deployment completed',  time: '2h ago' },
  { color: '#0055FF', text: 'New AI model v3.2 deployed',         time: '5h ago' },
  { color: '#7C3AED', text: 'Etisalat proposal submitted',        time: '1d ago' },
  { color: '#D97706', text: 'DEWA partnership signed',            time: '2d ago' },
  { color: '#059669', text: 'Q2 revenue target exceeded by 18%',  time: '3d ago' },
];

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline() {
  const chartW = W - 48 - 48;
  const chartH = 56;
  const pad = 8;
  const pts = SPARK.map((v, i) => {
    const x = pad + (i / (SPARK.length - 1)) * (chartW - pad * 2);
    const y = chartH - pad - ((v / 100) * (chartH - pad * 2));
    return `${x},${y}`;
  });
  const linePoints = pts.join(' ');
  const first = pts[0];
  const last  = pts[pts.length - 1];
  const fillD = `M ${first} L ${pts.slice(1).join(' L ')} L ${last.split(',')[0]},${chartH} L ${first.split(',')[0]},${chartH} Z`;

  return (
    <Svg width={chartW} height={chartH}>
      <Path d={fillD} fill="rgba(255,255,255,0.18)" />
      <Polyline
        points={linePoints}
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ── Animated ring arc ─────────────────────────────────────────────────────────
function AnimatedRingArc({
  progress, color, R, STROKE, CIRC, borderColor,
}: {
  progress: Animated.Value;
  color: string;
  R: number;
  STROKE: number;
  CIRC: number;
  borderColor: string;
}) {
  const [dashLen, setDashLen] = useState(0);

  useEffect(() => {
    const id = progress.addListener(({ value }) => setDashLen(value * CIRC));
    return () => progress.removeListener(id);
  }, []);

  const size = (R + STROKE) * 2 + 4;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <Svg width={size} height={size}>
      <Circle cx={cx} cy={cy} r={R} stroke={borderColor} strokeWidth={STROKE} fill="none" />
      <Circle
        cx={cx} cy={cy} r={R}
        stroke={color}
        strokeWidth={STROKE}
        fill="none"
        strokeDasharray={`${dashLen} ${CIRC}`}
        strokeDashoffset={0}
        strokeLinecap="round"
        rotation="-90"
        origin={`${cx},${cy}`}
      />
    </Svg>
  );
}

// ── Metric ring ───────────────────────────────────────────────────────────────
function MetricRing({ ring }: { ring: typeof RINGS[0] }) {
  const { colors } = useTheme();
  const progress = useRef(new Animated.Value(0)).current;
  const R = 36;
  const STROKE = 7;
  const CIRC = 2 * Math.PI * R;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: ring.numVal / ring.maxVal,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={[styles.ringWrap, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
      <AnimatedRingArc
        progress={progress}
        color={ring.color}
        R={R}
        STROKE={STROKE}
        CIRC={CIRC}
        borderColor={colors.borderLight}
      />
      <View style={styles.ringCenter} pointerEvents="none">
        <Text style={[styles.ringValue, { color: colors.text }]}>{ring.value}</Text>
      </View>
      <Text style={[styles.ringLabel, { color: colors.textSecondary }]}>{ring.label}</Text>
    </View>
  );
}

// ── Donut chart ───────────────────────────────────────────────────────────────
function DonutChart() {
  const { colors } = useTheme();
  const progress = useRef(new Animated.Value(0)).current;
  const [pct, setPct] = useState(0);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    const id = progress.addListener(({ value }) => setPct(value));
    return () => progress.removeListener(id);
  }, []);

  const R = 60;
  const STROKE = 18;
  const CIRC = 2 * Math.PI * R;
  const CX = 88;
  const CY = 88;
  const size = 176;

  let offset = 0;
  const arcs = DONUT.map((seg) => {
    const dash = (seg.pct / 100) * CIRC * pct;
    const gap  = CIRC - dash;
    const el = (
      <Circle
        key={seg.label}
        cx={CX} cy={CY} r={R}
        stroke={seg.color}
        strokeWidth={STROKE}
        fill="none"
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={-offset * pct}
        strokeLinecap="butt"
        rotation="-90"
        origin={`${CX},${CY}`}
      />
    );
    offset += (seg.pct / 100) * CIRC;
    return el;
  });

  return (
    <View style={styles.donutWrap}>
      <Svg width={size} height={size}>
        <Circle cx={CX} cy={CY} r={R} stroke={colors.borderLight} strokeWidth={STROKE} fill="none" />
        {arcs}
      </Svg>
      <View style={styles.donutCenter} pointerEvents="none">
        <Text style={[styles.donutCenterVal, { color: colors.text }]}>3</Text>
        <Text style={[styles.donutCenterLabel, { color: colors.textSecondary }]}>Stages</Text>
      </View>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerY      = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(headerY,      { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Header ── */}
        <Animated.View style={[styles.header, { opacity: headerOpacity, transform: [{ translateY: headerY }] }]}>
          <View style={styles.headerLeft}>
            <LinearGradient colors={['#0055FF', '#7C3AED']} style={styles.avatar}>
              <Text style={styles.avatarText}>RA</Text>
            </LinearGradient>
            <View>
              <Text style={[styles.greeting, { color: colors.textSecondary }]}>{greeting},</Text>
              <Text style={[styles.userName, { color: colors.text }]}>Rasha Aljalam</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/notifications' as any);
            }}
          >
            <Text style={{ fontSize: 20 }}>🔔</Text>
            <View style={[styles.notifDot, { borderColor: colors.surface }]} />
          </TouchableOpacity>
        </Animated.View>

        {/* ── Revenue Hero Card ── */}
        <LinearGradient
          colors={['#0055FF', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>Total Revenue</Text>
              <Text style={styles.heroValue}>AED 4.2B</Text>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>↑ +18% this month</Text>
              </View>
            </View>
          </View>
          <View style={styles.sparklineContainer}>
            <Sparkline />
          </View>
        </LinearGradient>

        {/* ── Metric Rings ── */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Metrics</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.ringsRow}
        >
          {RINGS.map((r) => (
            <MetricRing key={r.label} ring={r} />
          ))}
        </ScrollView>

        {/* ── Project Status Donut ── */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Project Status</Text>
        <View style={[styles.donutCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
          <DonutChart />
          <View style={styles.donutLegend}>
            {DONUT.map((seg) => (
              <View key={seg.label} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: seg.color }]} />
                <Text style={[styles.legendLabel, { color: colors.textSecondary }]}>{seg.label}</Text>
                <Text style={[styles.legendPct, { color: colors.text }]}>{seg.pct}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Quick Actions ── */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          {QUICK_ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.label}
              style={styles.actionItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push(a.route as any);
              }}
              activeOpacity={0.82}
            >
              <LinearGradient colors={a.colors} style={styles.actionCircle}>
                <Text style={{ fontSize: 26 }}>{a.icon}</Text>
              </LinearGradient>
              <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Activity Timeline ── */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 8 }]}>Recent Activity</Text>
        <View style={styles.timeline}>
          {ACTIVITIES.map((a, i) => (
            <View key={i} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineDot, { backgroundColor: a.color }]} />
                {i < ACTIVITIES.length - 1 && (
                  <View style={[styles.timelineConnector, { backgroundColor: colors.borderLight }]} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineText, { color: colors.text }]}>{a.text}</Text>
                <Text style={[styles.timelineTime, { color: colors.textMuted }]}>{a.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 56 : 40 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5 },
  greeting: { fontSize: 12, fontWeight: '400' },
  userName: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  iconBtn: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  notifDot: {
    position: 'absolute', top: 9, right: 9,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#DC2626', borderWidth: 1.5,
  },

  // Hero card
  heroCard: { borderRadius: 24, padding: 24, marginBottom: 28, overflow: 'hidden' },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  heroLabel: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: '500', marginBottom: 4 },
  heroValue: { fontSize: 42, fontWeight: '900', color: '#FFFFFF', letterSpacing: -1.5 },
  heroBadge: {
    marginTop: 6, alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  heroBadgeText: { fontSize: 12, color: '#FFFFFF', fontWeight: '700' },
  sparklineContainer: { marginTop: 4, marginHorizontal: -4 },

  // Section title
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 14 },

  // Rings
  ringsRow: { gap: 12, paddingRight: 24, marginBottom: 28 },
  ringWrap: {
    alignItems: 'center',
    width: 100,
    paddingTop: 12, paddingBottom: 12, paddingHorizontal: 6,
    borderRadius: 18,
    shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  ringCenter: {
    position: 'absolute', top: 12, left: 0, right: 0,
    height: 90,
    alignItems: 'center', justifyContent: 'center',
  },
  ringValue: { fontSize: 14, fontWeight: '800', letterSpacing: -0.3 },
  ringLabel: { fontSize: 11, fontWeight: '500', marginTop: 8, textAlign: 'center' },

  // Donut
  donutCard: {
    borderRadius: 20, padding: 20,
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 28,
    shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  donutWrap: { position: 'relative', alignItems: 'center', justifyContent: 'center', width: 176, height: 176 },
  donutCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  donutCenterVal: { fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  donutCenterLabel: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  donutLegend: { flex: 1, paddingLeft: 20, gap: 16 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { flex: 1, fontSize: 13, fontWeight: '500' },
  legendPct: { fontSize: 14, fontWeight: '700' },

  // Quick actions
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  actionItem: { alignItems: 'center', gap: 8 },
  actionCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },

  // Timeline
  timeline: { gap: 0, marginBottom: 4 },
  timelineItem: { flexDirection: 'row', gap: 14 },
  timelineLeft: { alignItems: 'center', width: 14 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, marginTop: 3 },
  timelineConnector: { flex: 1, width: 2, marginTop: 4, minHeight: 28 },
  timelineContent: { flex: 1, paddingBottom: 20 },
  timelineText: { fontSize: 13, fontWeight: '500', lineHeight: 19 },
  timelineTime: { fontSize: 11, marginTop: 2 },
});
