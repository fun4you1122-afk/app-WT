import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay, withRepeat,
  withSequence, Easing, interpolate, useAnimatedProps,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Circle, Path, Line, Text as SvgText, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import AnimatedBackground from '../../components/AnimatedBackground';
import GlassCard from '../../components/GlassCard';
import { Colors } from '../../constants/Colors';
import { Typography, Spacing, Radius } from '../../constants/Theme';

const { width: W } = Dimensions.get('window');
const CHART_W = W - Spacing.md * 2 - 40;

const MONTHLY_DATA = [62, 78, 55, 85, 70, 95, 80, 92, 75, 88, 96, 100];
const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

function BarChart() {
  const barH = 140;
  const barW = CHART_W / MONTHLY_DATA.length - 4;
  return (
    <Svg width={CHART_W} height={barH + 20}>
      <Defs>
        <SvgGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={Colors.neonBlue} stopOpacity="1" />
          <Stop offset="100%" stopColor={Colors.electricBlue} stopOpacity="0.4" />
        </SvgGradient>
        <SvgGradient id="barGradActive" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={Colors.neonCyan} stopOpacity="1" />
          <Stop offset="100%" stopColor={Colors.neonBlue} stopOpacity="0.6" />
        </SvgGradient>
      </Defs>
      {MONTHLY_DATA.map((v, i) => {
        const h = (v / 100) * barH;
        const x = i * (CHART_W / MONTHLY_DATA.length) + 2;
        return (
          <React.Fragment key={i}>
            <Rect
              x={x}
              y={barH - h}
              width={barW}
              height={h}
              rx={3}
              fill={i === MONTHLY_DATA.length - 1 ? 'url(#barGradActive)' : 'url(#barGrad)'}
              opacity={i === MONTHLY_DATA.length - 1 ? 1 : 0.7}
            />
            <SvgText x={x + barW / 2} y={barH + 14} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={9}>{MONTHS[i]}</SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

function DonutChart({ value, total, color, label }: { value: number; total: number; color: string; label: string }) {
  const r = 36, cx = 48, cy = 48, strokeW = 8;
  const circumference = 2 * Math.PI * r;
  const percent = value / total;
  const dash = percent * circumference;
  return (
    <View style={styles.donutWrap}>
      <Svg width={96} height={96}>
        <Circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW} />
        <Circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth={strokeW}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          opacity={0.9}
        />
        <SvgText x={cx} y={cy + 5} textAnchor="middle" fill={color} fontSize={14} fontWeight="700">
          {Math.round(percent * 100)}%
        </SvgText>
      </Svg>
      <Text style={[styles.donutLabel, { color: Colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

function AnimatedProgressBar({ value, color, label, delay = 0 }: { value: number; color: string; label: string; delay?: number }) {
  const width = useSharedValue(0);
  useEffect(() => {
    width.value = withDelay(delay, withTiming(value, { duration: 1200, easing: Easing.out(Easing.cubic) }));
  }, []);
  const barStyle = useAnimatedStyle(() => ({ width: `${width.value}%` as any }));
  return (
    <View style={styles.progressItem}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={[styles.progressValue, { color }]}>{value}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, barStyle, { backgroundColor: color, shadowColor: color }]} />
      </View>
    </View>
  );
}

const KPI_DATA = [
  { label: 'Total Revenue', value: 'AED 4.2M', change: '+18.3%', up: true, color: Colors.success },
  { label: 'Active Projects', value: '247', change: '+12', up: true, color: Colors.neonBlue },
  { label: 'AI Accuracy', value: '95.2%', change: '+2.1%', up: true, color: Colors.neonPurple },
  { label: 'Client NPS', value: '87', change: '+5pts', up: true, color: Colors.neonCyan },
];

export default function AnalyticsScreen() {
  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>INSIGHTS</Text>
          <Text style={styles.title}>Analytics <Text style={{ color: Colors.success }}>Hub</Text></Text>
        </View>

        {/* KPI Row */}
        <View style={styles.kpiGrid}>
          {KPI_DATA.map((kpi, i) => (
            <GlassCard key={i} glowColor={kpi.color} delay={i * 80} style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
              <Text style={[styles.kpiValue, { color: kpi.color, textShadowColor: kpi.color, textShadowRadius: 8 }]}>{kpi.value}</Text>
              <View style={[styles.kpiChange, { backgroundColor: `${kpi.color}15` }]}>
                <Text style={[styles.kpiChangeText, { color: kpi.color }]}>{kpi.up ? '↑' : '↓'} {kpi.change}</Text>
              </View>
            </GlassCard>
          ))}
        </View>

        {/* Monthly Revenue Chart */}
        <GlassCard style={styles.chartCard} glowColor={Colors.neonBlue} delay={350}>
          <Text style={styles.cardTitle}>Monthly Performance</Text>
          <Text style={styles.chartSubtitle}>Revenue & Project Completion — 2024</Text>
          <View style={styles.chartArea}>
            <BarChart />
          </View>
        </GlassCard>

        {/* Donut Charts */}
        <GlassCard style={styles.donutCard} glowColor={Colors.neonPurple} delay={450}>
          <Text style={styles.cardTitle}>Service Distribution</Text>
          <View style={styles.donutRow}>
            <DonutChart value={38} total={100} color={Colors.neonBlue} label="AI & ML" />
            <DonutChart value={25} total={100} color={Colors.neonCyan} label="Cloud" />
            <DonutChart value={20} total={100} color={Colors.neonPurple} label="Security" />
            <DonutChart value={17} total={100} color={Colors.success} label="Dev" />
          </View>
        </GlassCard>

        {/* Progress Metrics */}
        <GlassCard style={styles.progressCard} glowColor={Colors.neonCyan} delay={550}>
          <Text style={styles.cardTitle}>Performance Metrics</Text>
          <View style={styles.progressList}>
            <AnimatedProgressBar value={95} color={Colors.neonBlue} label="AI Model Accuracy" delay={600} />
            <AnimatedProgressBar value={87} color={Colors.success} label="Client Satisfaction" delay={700} />
            <AnimatedProgressBar value={92} color={Colors.neonPurple} label="On-time Delivery" delay={800} />
            <AnimatedProgressBar value={78} color={Colors.neonCyan} label="Cloud Efficiency" delay={900} />
            <AnimatedProgressBar value={99} color={Colors.neonPink} label="System Uptime" delay={1000} />
          </View>
        </GlassCard>

        {/* Region breakdown */}
        <GlassCard style={styles.regionCard} glowColor={Colors.warning} delay={650}>
          <Text style={styles.cardTitle}>Regional Presence</Text>
          {[
            { region: 'Dubai', clients: 89, share: 50, color: Colors.neonBlue },
            { region: 'Abu Dhabi', clients: 54, share: 30, color: Colors.neonPurple },
            { region: 'Sharjah', clients: 23, share: 13, color: Colors.neonCyan },
            { region: 'Other UAE', clients: 14, share: 8, color: Colors.success },
          ].map((r, i) => (
            <View key={i} style={styles.regionRow}>
              <View style={[styles.regionDot, { backgroundColor: r.color }]} />
              <Text style={styles.regionName}>{r.region}</Text>
              <View style={styles.regionBar}>
                <View style={[styles.regionFill, { width: `${r.share}%`, backgroundColor: r.color }]} />
              </View>
              <Text style={[styles.regionClients, { color: r.color }]}>{r.clients}</Text>
            </View>
          ))}
        </GlassCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.md, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  header: { marginBottom: Spacing.lg },
  subtitle: { ...Typography.label, color: Colors.success, letterSpacing: 2, marginBottom: 8 },
  title: { ...Typography.displayMD, color: Colors.white, fontWeight: '800' },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  kpiCard: { width: (W - Spacing.md * 2 - Spacing.sm) / 2, padding: Spacing.md },
  kpiLabel: { ...Typography.caption, color: Colors.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  kpiValue: { ...Typography.headingLG, fontWeight: '700', marginBottom: 6 },
  kpiChange: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  kpiChangeText: { ...Typography.caption, fontWeight: '700' },
  chartCard: { padding: Spacing.lg, marginBottom: Spacing.md },
  cardTitle: { ...Typography.headingSM, color: Colors.textPrimary, marginBottom: 4 },
  chartSubtitle: { ...Typography.caption, color: Colors.textMuted, marginBottom: 16 },
  chartArea: { alignItems: 'flex-start' },
  donutCard: { padding: Spacing.lg, marginBottom: Spacing.md },
  donutRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
  donutWrap: { alignItems: 'center' },
  donutLabel: { ...Typography.caption, marginTop: 4 },
  progressCard: { padding: Spacing.lg, marginBottom: Spacing.md },
  progressList: { gap: 16, marginTop: 12 },
  progressItem: {},
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { ...Typography.bodyMD, color: Colors.textSecondary },
  progressValue: { ...Typography.bodyMD, fontWeight: '700' },
  progressTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, shadowOpacity: 0.7, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } },
  regionCard: { padding: Spacing.lg, marginBottom: Spacing.md },
  regionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  regionDot: { width: 8, height: 8, borderRadius: 4 },
  regionName: { ...Typography.bodyMD, color: Colors.textSecondary, width: 80 },
  regionBar: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' },
  regionFill: { height: '100%', borderRadius: 3 },
  regionClients: { ...Typography.bodyMD, fontWeight: '700', width: 28, textAlign: 'right' },
});
